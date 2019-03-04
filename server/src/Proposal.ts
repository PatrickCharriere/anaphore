import { User, FormattedUser } from './User';

export interface FormattedProposal {
    proposer: FormattedUser,
    opponent: FormattedUser
}

export class Proposal {
    
    public proposer: User
    public opponent: User

    public constructor() {
        
    }

    public get formatted(): FormattedProposal {
        return {
            proposer: this.proposer.formattedUser,
            opponent: this.opponent.formattedUser,
        }
    }
    
}

export interface ProposalResponse {
    proposal: Proposal,
    accepted: boolean,
}