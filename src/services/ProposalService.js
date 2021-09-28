import axios from "axios";
import authHeader from './AuthHeader'
const PROPOSAL_API_URL = "https://carworld.cosplane.asia/api/proposal/"

class ProposalService {
    getAllProposals() {
        return axios.get(PROPOSAL_API_URL + "GetAllProposal", { headers: authHeader() })
    }
    approveProposal() {
        return axios.put(PROPOSAL_API_URL + "ApprovedProposal", { headers: authHeader() })
    }
    disapproveProposal() {
        return axios.put(PROPOSAL_API_URL + "DisApprovedProposal", { headers: authHeader() })
    }

}

export default new ProposalService();