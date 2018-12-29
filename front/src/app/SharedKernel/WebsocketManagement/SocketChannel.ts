
export enum SocketChannel {
    CreatePlayer = "CreatePlayer",
    PlayerCreated = "PlayerCreated",
    ListWaitingRoomRequest = "ListWaitingRoomRequest",
    ListWaitingRoomReply = "ListWaitingRoomReply",
    ProposeGame = "ProposeGame",
    GameProposed = "GameProposed",
    GameProposalResponse = "GameProposalResponse",
    StartGame = "StartGame",
    PlayerStatus = "PlayerStatus",
}