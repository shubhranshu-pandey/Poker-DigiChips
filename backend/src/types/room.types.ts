export interface Player {
    id: string;
    name: string;
    chips: number;
    socketId: string;
}

export interface Room {
    id: string;
    players: Player[];
    pot: number;
    createdAt: string;
    maxPlayers: number;
}
