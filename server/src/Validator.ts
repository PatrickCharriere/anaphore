import { Player } from "./Player";
import { Proposal, ProposalResponse } from './Proposal';

export class Validator {

    static checkAndCreatePlayer(message): Player {

        let createdPlayer: Player;

        try {

            let temp = JSON.parse(message)

            if (temp.hasOwnProperty('name') && (1 === Object.keys(temp).length)) {

                createdPlayer = temp

            } else {

                throw "Bad structure for user"

            }

        } catch(error) {

            throw error

        }

        return createdPlayer
        
    }

    static checkAndCreateProposal(message): Proposal {

        let proposal: Proposal

        try {

            const temp = JSON.parse(message)

            if (temp.hasOwnProperty('proposer') &&
            temp.proposer.hasOwnProperty('id') &&
            temp.proposer.hasOwnProperty('name') &&
            temp.hasOwnProperty('opponent') &&
            temp.opponent.hasOwnProperty('id') &&
            temp.opponent.hasOwnProperty('name')) {

                proposal = temp;

            } else {

                throw "Bad structure for proposal"

            }

        }
        catch (error) {

            throw error

        }

        return proposal

    }

    static checkAndCreateProposalResponse(message): ProposalResponse {

        let proposalResponse: ProposalResponse

        try {

            const temp = JSON.parse(message)

            if (temp.hasOwnProperty('accepted') &&
            temp.hasOwnProperty('proposal') &&
            temp.proposal.hasOwnProperty('proposer') &&
            temp.proposal.proposer.hasOwnProperty('id') &&
            temp.proposal.proposer.hasOwnProperty('name') &&
            temp.proposal.hasOwnProperty('opponent') &&
            temp.proposal.opponent.hasOwnProperty('id') &&
            temp.proposal.opponent.hasOwnProperty('name')) {

                proposalResponse = temp;

            } else {

                throw "Bad structure for proposal response"

            }

        }
        catch (error) {

            throw error

        }

        return proposalResponse

    }

}