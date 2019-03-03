import { User } from './User';

export class Proposal {
    public proposer: User
    public opponent: User

    
}

export interface ProposalResponse {
    proposal: Proposal,
    accepted: boolean,
}