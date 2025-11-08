import redisClient from './redis';
import { Player, Room } from '../types/room.types';

const ROOM_PREFIX = 'room:';
const ROOM_EXPIRY = 86400;

export class RoomManager {
    async createRoom(roomId: string, maxPlayers: number = 10): Promise<Room> {
        const room: Room = {
            id: roomId,
            players: [],
            pot: 0,
            createdAt: new Date().toISOString(),
            maxPlayers
        };

        await redisClient.setEx(
            `${ROOM_PREFIX}${roomId}`,
            ROOM_EXPIRY,
            JSON.stringify(room)
        );

        console.log(`✅ Room created: ${roomId}`);
        return room;
    }

    async getRoom(roomId: string): Promise<Room | null> {
        const data = await redisClient.get(`${ROOM_PREFIX}${roomId}`);
        return data ? JSON.parse(data) : null;
    }

    async updateRoom(room: Room): Promise<void> {
        await redisClient.setEx(
            `${ROOM_PREFIX}${room.id}`,
            ROOM_EXPIRY,
            JSON.stringify(room)
        );
    }

    async addPlayer(roomId: string, player: Player): Promise<Room | null> {
        const room = await this.getRoom(roomId);
        if (!room) return null;

        if (room.players.length >= room.maxPlayers) {
            throw new Error('Room is full');
        }

        const existingIndex = room.players.findIndex(p => p.id === player.id);

        if (existingIndex >= 0) {
            room.players[existingIndex] = player;
        } else {
            room.players.push(player);
        }

        await this.updateRoom(room);
        console.log(`✅ Player ${player.name} added to room ${roomId}`);
        return room;
    }

    async removePlayer(roomId: string, playerId: string): Promise<Room | null> {
        const room = await this.getRoom(roomId);
        if (!room) return null;

        room.players = room.players.filter(p => p.id !== playerId);

        // If room is empty, delete it
        if (room.players.length === 0) {
            await this.deleteRoom(roomId);
            console.log(`🗑️  Room ${roomId} deleted (empty)`);
            return null;
        }

        await this.updateRoom(room);
        console.log(`❌ Player ${playerId} removed from room ${roomId} (${room.players.length} remaining)`);
        return room;
    }

    async deleteRoom(roomId: string): Promise<void> {
        await redisClient.del(`${ROOM_PREFIX}${roomId}`);
        console.log(`🗑️  Room ${roomId} deleted from Redis`);
    }
}

export default new RoomManager();
