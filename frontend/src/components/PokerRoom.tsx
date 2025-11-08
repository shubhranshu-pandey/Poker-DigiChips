'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { GamePhase } from '@/types/room.types';

export default function PokerRoom() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isConnected, room, error, joinRoom, leaveRoom, manualBet, takePot } = useSocket();

    const [hasJoined, setHasJoined] = useState(false);
    const [customBetAmount, setCustomBetAmount] = useState<string>('');

    useEffect(() => {
        const roomId = searchParams.get('roomId');
        const playerName = searchParams.get('playerName');
        const playerId = searchParams.get('playerId');
        const chips = searchParams.get('chips');

        if (roomId && playerName && playerId && isConnected && !hasJoined) {
            joinRoom(roomId, playerName, playerId, Number(chips) || 1000);
            setHasJoined(true);
        }
    }, [searchParams, isConnected, hasJoined, joinRoom]);

    const handleLeaveRoom = () => {
        const playerId = searchParams.get('playerId');
        if (room && playerId) {
            leaveRoom(room.id, playerId);
            router.push('/');
        }
    };

    const currentPlayerId = searchParams.get('playerId');
    const currentPlayer = room?.players.find(p => p.id === currentPlayerId);

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Minimal Header */}
                <div className="flex justify-between items-center mb-12 pb-4 border-b border-white/20">
                    <div>
                        <h1 className="text-xl font-light text-white tracking-wide">{room?.id || 'Poker'}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-white/40'}`} />
                            <span className="text-xs text-white/60">{isConnected ? 'Live' : 'Offline'}</span>
                        </div>
                    </div>
                    {room && (
                        <button
                            onClick={handleLeaveRoom}
                            className="text-xs text-white/60 hover:text-white transition-colors"
                        >
                            Exit
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {!room && isConnected && (
                    <div className="text-center py-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b border-white/40 mx-auto mb-4"></div>
                        <p className="text-white/60 text-sm">Joining...</p>
                    </div>
                )}

                {/* Main Content */}
                {room && (
                    <div className="space-y-12">
                        {/* Pot - Minimal Center */}
                        <div className="text-center py-12">
                            <div className="text-7xl font-extralight text-white mb-3 tracking-tight">${room.pot}</div>
                            <div className="text-xs text-white/50 uppercase tracking-widest">Pot</div>
                        </div>

                        {/* Bet Input - Clean */}
                        {currentPlayer && (
                            <div className="max-w-xs mx-auto space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={customBetAmount}
                                        onChange={(e) => setCustomBetAmount(e.target.value)}
                                        placeholder="0"
                                        min="1"
                                        max={currentPlayer.chips}
                                        className="flex-1 px-4 py-3 bg-transparent border border-white/30 rounded text-white text-center focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/30"
                                    />
                                    <button
                                        onClick={() => {
                                            const amount = parseInt(customBetAmount);
                                            if (isNaN(amount) || amount <= 0) return;
                                            if (amount > currentPlayer.chips) return;
                                            const playerId = searchParams.get('playerId');
                                            if (room && playerId) {
                                                manualBet(room.id, playerId, amount);
                                            }
                                            setCustomBetAmount('');
                                        }}
                                        disabled={!customBetAmount}
                                        className="px-8 py-3 bg-white text-black rounded hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 transition-colors text-sm font-medium"
                                    >
                                        Bet
                                    </button>
                                </div>
                                <div className="text-xs text-white/50 text-center">
                                    ${currentPlayer.chips} available
                                </div>
                            </div>
                        )}

                        {/* Leaderboard */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm text-white/60 uppercase tracking-widest">Leaderboard</h3>
                                <span className="text-xs text-white/40">{room.players.length} players</span>
                            </div>
                            <div className="space-y-1">
                                {[...room.players]
                                    .sort((a, b) => b.chips - a.chips)
                                    .map((player, index) => (
                                        <div
                                            key={player.id}
                                            className={`flex items-center justify-between py-4 px-4 border-b border-white/10 ${player.id === currentPlayerId ? 'bg-white/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-white/40 text-xs font-mono w-6">#{index + 1}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-white font-light">{player.name}</span>
                                                    {player.id === currentPlayerId && (
                                                        <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">you</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base text-white font-light">${player.chips.toLocaleString()}</span>
                                                {/* Only show Take Pot button for current player */}
                                                {room.pot > 0 && player.id === currentPlayerId && (
                                                    <button
                                                        onClick={() => {
                                                            if (room && currentPlayerId) {
                                                                takePot(room.id, currentPlayerId);
                                                            }
                                                        }}
                                                        className="text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors"
                                                    >
                                                        Take Pot
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
