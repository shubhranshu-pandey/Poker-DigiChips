export enum GamePhase {
    WAITING = 'waiting',
    PREFLOP = 'preflop',
    FLOP = 'flop',
    TURN = 'turn',
    RIVER = 'river',
    SHOWDOWN = 'showdown'
}

export enum PlayerAction {
    FOLD = 'fold',
    CHECK = 'check',
    CALL = 'call',
    BET = 'bet',
    RAISE = 'raise',
    ALL_IN = 'all_in'
}

export interface Player {
    id: string;
    name: string;
    chips: number;
    socketId: string;
    currentBet: number;
    hasFolded: boolean;
    isAllIn: boolean;
    hasActed: boolean;
}

export interface SidePot {
    amount: number;
    eligiblePlayers: string[];
}

export interface Room {
    id: string;
    players: Player[];
    pot: number;
    sidePots: SidePot[];
    createdAt: string;
    maxPlayers: number;

    // Game state
    gamePhase: GamePhase;
    dealerIndex: number;
    toActIndex: number;
    currentBet: number;
    minimumRaise: number;

    // Config
    blindsEnabled: boolean;
    smallBlind: number;
    bigBlind: number;
    buyIn: number;
}

export interface RoomJoinedResponse {
    room: Room;
    playerId: string;
}

export interface ErrorResponse {
    message: string;
}
