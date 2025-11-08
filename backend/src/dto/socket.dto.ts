export interface JoinRoomDto {
    roomId: string;
    playerName: string;
    playerId: string;
    startingChips?: number;
}

export interface LeaveRoomDto {
    roomId: string;
    playerId: string;
}

export interface RoomJoinedResponse {
    room: any;
    playerId: string;
}

export interface ErrorResponse {
    message: string;
}
