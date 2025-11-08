import { Server, Socket } from 'socket.io';
import roomManager from '../utils/roomManager';
import { Player } from '../types/room.types';
import {
    JoinRoomDto,
    LeaveRoomDto,
    RoomJoinedResponse,
    ErrorResponse
} from '../dto/socket.dto';

// Track socket to player/room mapping
const socketToPlayer = new Map<string, { roomId: string; playerId: string }>();

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        //join room
        socket.on('join-room', async (data: JoinRoomDto) => {
            try {
                const { roomId, playerName, playerId, startingChips = 1000 } = data;

                console.log(`Join room request - Room: ${roomId}, Player: ${playerName}`);

                let room = await roomManager.getRoom(roomId);

                if (!room) {
                    console.log(`Creating new room: ${roomId}`);
                    room = await roomManager.createRoom(roomId);
                }

                // Add player
                const player: Player = {
                    id: playerId,
                    name: playerName,
                    chips: startingChips,
                    socketId: socket.id
                };

                room = await roomManager.addPlayer(roomId, player);

                socket.join(roomId);

                // Track this socket's player and room
                socketToPlayer.set(socket.id, { roomId, playerId });

                socket.emit('room-joined', { room, playerId } as RoomJoinedResponse);

                io.to(roomId).emit('room-updated', room);

                console.log(`${playerName} joined room ${roomId} (${room?.players.length} players)`);
            } catch (error: any) {
                console.error('Error joining room:', error.message);
                socket.emit('error', { message: error.message } as ErrorResponse);
            }
        });

        // Leave room
        socket.on('leave-room', async (data: LeaveRoomDto) => {
            try {
                const { roomId, playerId } = data;
                console.log(`Leave room request - Room: ${roomId}, Player: ${playerId}`);

                const room = await roomManager.removePlayer(roomId, playerId);

                socket.leave(roomId);
                socketToPlayer.delete(socket.id);

                if (room) {
                    io.to(roomId).emit('room-updated', room);
                } else {
                    console.log(`Room ${roomId} was deleted (empty)`);
                }

                console.log(`Player ${playerId} left room ${roomId}`);
            } catch (error) {
                console.error('Error leaving room:', error);
            }
        });

        // Manual bet to pot
        socket.on('manual-bet', async (data: {
            roomId: string;
            playerId: string;
            amount: number;
        }) => {
            try {
                const { roomId, playerId, amount } = data;
                console.log(`💵 Manual bet - Room: ${roomId}, Player: ${playerId}, Amount: ${amount}`);

                let room = await roomManager.getRoom(roomId);
                if (!room) {
                    socket.emit('error', { message: 'Room not found' } as ErrorResponse);
                    return;
                }

                const player = room.players.find(p => p.id === playerId);
                if (!player) {
                    socket.emit('error', { message: 'Player not found' } as ErrorResponse);
                    return;
                }

                if (amount > player.chips) {
                    socket.emit('error', { message: 'Insufficient chips' } as ErrorResponse);
                    return;
                }

                // Deduct from player and add to pot
                player.chips -= amount;
                room.pot += amount;

                await roomManager.updateRoom(room);
                io.to(roomId).emit('room-updated', room);
                console.log(`✅ ${player.name} bet $${amount} to pot`);
            } catch (error: any) {
                console.error('Error processing manual bet:', error.message);
                socket.emit('error', { message: error.message } as ErrorResponse);
            }
        });

        // Take pot
        socket.on('take-pot', async (data: {
            roomId: string;
            playerId: string;
        }) => {
            try {
                const { roomId, playerId } = data;
                console.log(`🏆 Take pot - Room: ${roomId}, Player: ${playerId}`);

                let room = await roomManager.getRoom(roomId);
                if (!room) {
                    socket.emit('error', { message: 'Room not found' } as ErrorResponse);
                    return;
                }

                const player = room.players.find(p => p.id === playerId);
                if (!player) {
                    socket.emit('error', { message: 'Player not found' } as ErrorResponse);
                    return;
                }

                if (room.pot === 0) {
                    socket.emit('error', { message: 'Pot is empty' } as ErrorResponse);
                    return;
                }

                // Add pot to player and reset pot
                const potAmount = room.pot;
                player.chips += potAmount;
                room.pot = 0;

                await roomManager.updateRoom(room);
                io.to(roomId).emit('room-updated', room);
                console.log(`✅ ${player.name} took pot of $${potAmount}`);
            } catch (error: any) {
                console.error('Error taking pot:', error.message);
                socket.emit('error', { message: error.message } as ErrorResponse);
            }
        });

        // Disconnect - Auto cleanup
        socket.on('disconnect', async () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);

            const playerInfo = socketToPlayer.get(socket.id);
            if (playerInfo) {
                const { roomId, playerId } = playerInfo;
                try {
                    console.log(`🧹 Auto-removing player ${playerId} from room ${roomId} (disconnect)`);
                    const room = await roomManager.removePlayer(roomId, playerId);

                    socketToPlayer.delete(socket.id);

                    if (room) {
                        io.to(roomId).emit('room-updated', room);
                        console.log(`✅ Player removed, ${room.players.length} players remaining`);
                    } else {
                        console.log(`🗑️  Room ${roomId} was deleted (empty after disconnect)`);
                    }
                } catch (error) {
                    console.error('Error during disconnect cleanup:', error);
                }
            }
        });
    });
};
