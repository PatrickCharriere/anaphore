import { User } from './users';

export interface Proposal {
    proposer: User,
    opponent: User,
}

export interface ProposalResponse {
    proposal: Proposal,
    accepted: boolean,
}