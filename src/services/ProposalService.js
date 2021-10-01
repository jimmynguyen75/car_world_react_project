import axios from "axios";
import authHeader from './AuthHeader'
const PROPOSAL_API_URL = "https://carworld.cosplane.asia/api/proposal/"

class ProposalService {
    getAllProposals() {
        return axios.get(PROPOSAL_API_URL + "GetAllProposal", { headers: authHeader() })
    }
    approveProposal(proposal) {
        return axios.put(PROPOSAL_API_URL + "ApprovedProposal", proposal, { headers: authHeader() })
    }
    disapproveProposal(proposal) {
        return axios.put(PROPOSAL_API_URL + "DisApprovedProposal", proposal, { headers: authHeader() })
    }

}

export default new ProposalService();