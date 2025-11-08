'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [startingChips, setStartingChips] = useState(1000);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const generateRoomId = () => {
        const adjectives = ['lucky', 'royal', 'golden', 'diamond', 'ace', 'king', 'queen'];
        const nouns = ['poker', 'cards', 'chips', 'table', 'game', 'night'];
        const random = Math.floor(Math.random() * 1000);
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${random}`;
    };

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName.trim()) {
            alert('Please enter your name');
            return;
        }
        // Generate unique player ID from name and timestamp
        const generatedPlayerId = `${playerName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        const newRoomId = generateRoomId();
        router.push(`/room?roomId=${newRoomId}&playerName=${encodeURIComponent(playerName)}&playerId=${encodeURIComponent(generatedPlayerId)}&chips=${startingChips}`);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId.trim() || !playerName.trim()) {
            alert('Please fill in all fields');
            return;
        }
        // Generate unique player ID from name and timestamp
        const generatedPlayerId = `${playerName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        router.push(`/room?roomId=${roomId}&playerName=${encodeURIComponent(playerName)}&playerId=${encodeURIComponent(generatedPlayerId)}&chips=${startingChips}`);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extralight text-white mb-2 tracking-wide">Poker</h1>
                    <p className="text-sm text-white/50">Digital chip tracking</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-8">
                    {!showJoinForm && !showCreateForm && (
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="w-full bg-white text-black py-4 px-6 rounded hover:bg-white/90 transition-colors text-sm font-medium"
                            >
                                Create Room
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-white/5 text-white/50">or</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowJoinForm(true)}
                                className="w-full bg-transparent border border-white/40 text-white py-4 px-6 rounded hover:border-white/60 transition-colors text-sm"
                            >
                                Join Room
                            </button>
                        </div>
                    )}

                    {/* Create Room Form */}
                    {showCreateForm && (
                        <div>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="mb-6 text-white/50 hover:text-white text-sm transition-colors"
                            >
                                ← Back
                            </button>
                            <form onSubmit={handleCreateRoom} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/60 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-white/60 placeholder:text-white/30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-white/60 mb-2">Starting Chips</label>
                                    <input
                                        type="number"
                                        value={startingChips}
                                        onChange={(e) => setStartingChips(Number(e.target.value))}
                                        min="100"
                                        step="100"
                                        className="w-full px-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-white/60"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-3 px-6 rounded hover:bg-white/90 transition-colors text-sm mt-6 font-medium"
                                >
                                    Create
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Join Room Form */}
                    {showJoinForm && (
                        <div>
                            <button
                                onClick={() => setShowJoinForm(false)}
                                className="mb-6 text-white/50 hover:text-white text-sm transition-colors"
                            >
                                ← Back
                            </button>
                            <form onSubmit={handleJoinRoom} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/60 mb-2">Room ID</label>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        placeholder="room-id-123"
                                        className="w-full px-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-white/60 placeholder:text-white/30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-white/60 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-white/60 placeholder:text-white/30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-white/60 mb-2">Starting Chips</label>
                                    <input
                                        type="number"
                                        value={startingChips}
                                        onChange={(e) => setStartingChips(Number(e.target.value))}
                                        min="100"
                                        step="100"
                                        className="w-full px-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-white/60"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-3 px-6 rounded hover:bg-white/90 transition-colors text-sm mt-6 font-medium"
                                >
                                    Join
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-white/40 text-xs">
                    Track chips in real-time
                </div>
            </div>
        </div>
    );
}
