import { User } from './User';

export interface Proposal {
    proposer: User,
    opponent: User,
}

export interface ProposalResponse {
    proposal: Proposal,
    accepted: boolean,
}