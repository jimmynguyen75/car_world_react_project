import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';
const PROPOSAL_API_URL = "https://carworld.cosplane.asia/api/proposal/"

class ProposalService {
    getAllProposals() {
        return axios.get(PROPOSAL_API_URL + "GetAllProposal", { headers: authHeader() })
    }
    getProposalById(id) {
        return axios.get(PROPOSAL_API_URL + "GetProposalById?id=" + id, { headers: authHeader() })
    }
    approveProposal(proposal) {
        return axios.put(PROPOSAL_API_URL + "ApprovedProposal", proposal, { headers: authHeader() })
    }
    disapproveProposal(proposal) {
        return axios.put(PROPOSAL_API_URL + "DisApprovedProposal", proposal, { headers: authHeader() })
    }
    getProposalByMonth() {
        return axios.get(PROPOSAL_API_URL + "CountProposalsByMonth?date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
}

export default new ProposalService();