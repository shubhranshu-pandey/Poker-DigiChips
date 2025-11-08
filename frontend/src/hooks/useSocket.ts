'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, RoomJoinedResponse, ErrorResponse } from '@/types/room.types';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        console.log('Initializing Socket.IO connection to:', SOCKET_URL);

        // Create socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to server - Socket ID:', socket.id);
            setIsConnected(true);
            setError(null);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from server - Reason:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            setError('Connection failed. Make sure the backend is running.');
            setIsConnected(false);
        });

        socket.on('room-joined', (data: RoomJoinedResponse) => {
            console.log('Joined room:', data.room.id, 'Players:', data.room.players.length);
            setRoom(data.room);
            setError(null);
        });

        socket.on('room-updated', (updatedRoom: Room) => {
            console.log('Room updated:', updatedRoom.id, 'Players:', updatedRoom.players.length, 'Pot:', updatedRoom.pot);
            setRoom(updatedRoom);
        });

        socket.on('error', (data: ErrorResponse) => {
            console.error('Server error:', data.message);
            setError(data.message);
        });

        return () => {
            console.log('Cleaning up socket connection');
            socket.disconnect();
        };
    }, []);

    const joinRoom = useCallback((roomId: string, playerName: string, playerId: string, startingChips: number = 1000) => {
        if (!socketRef.current) {
            console.error('Socket not initialized');
            return;
        }

        console.log('Sending join-room event:', { roomId, playerName, playerId, startingChips });
        socketRef.current.emit('join-room', {
            roomId,
            playerName,
            playerId,
            startingChips
        });
    }, []);

    const leaveRoom = useCallback((roomId: string, playerId: string) => {
        if (!socketRef.current) return;

        console.log('Sending leave-room event:', { roomId, playerId });
        socketRef.current.emit('leave-room', { roomId, playerId });
        setRoom(null);
    }, []);

    const updateChips = useCallback((roomId: string, playerId: string, chips: number) => {
        if (!socketRef.current) return;

        console.log('Sending update-chips event:', { roomId, playerId, chips });
        socketRef.current.emit('update-chips', { roomId, playerId, chips });
    }, []);

    const updatePot = useCallback((roomId: string, amount: number) => {
        if (!socketRef.current) return;

        console.log('Sending update-pot event:', { roomId, amount });
        socketRef.current.emit('update-pot', { roomId, amount });
    }, []);

    const startHand = useCallback((roomId: string) => {
        if (!socketRef.current) return;

        console.log('Sending start-hand event:', { roomId });
        socketRef.current.emit('start-hand', { roomId });
    }, []);

    const playerAction = useCallback((roomId: string, playerId: string, action: string, amount?: number) => {
        if (!socketRef.current) return;

        console.log('Sending player-action event:', { roomId, playerId, action, amount });
        socketRef.current.emit('player-action', { roomId, playerId, action, amount });
    }, []);

    const resolveShowdown = useCallback((roomId: string, winnerIds: string[]) => {
        if (!socketRef.current) return;

        console.log('Sending resolve-showdown event:', { roomId, winnerIds });
        socketRef.current.emit('resolve-showdown', { roomId, winnerIds });
    }, []);

    const updateConfig = useCallback((roomId: string, config: any) => {
        if (!socketRef.current) return;

        console.log('Sending update-config event:', { roomId, config });
        socketRef.current.emit('update-config', { roomId, config });
    }, []);

    const manualBet = useCallback((roomId: string, playerId: string, amount: number) => {
        if (!socketRef.current) return;

        console.log('Sending manual-bet event:', { roomId, playerId, amount });
        socketRef.current.emit('manual-bet', { roomId, playerId, amount });
    }, []);

    const takePot = useCallback((roomId: string, playerId: string) => {
        if (!socketRef.current) return;

        console.log('Sending take-pot event:', { roomId, playerId });
        socketRef.current.emit('take-pot', { roomId, playerId });
    }, []);

    return {
        isConnected,
        room,
        error,
        joinRoom,
        leaveRoom,
        updateChips,
        updatePot,
        startHand,
        playerAction,
        resolveShowdown,
        updateConfig,
        manualBet,
        takePot
    };
};
