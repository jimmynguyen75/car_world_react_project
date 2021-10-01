import axios from "axios";
import authHeader from './AuthHeader'
const EVENT_API_URL = "https://carworld.cosplane.asia/api/event/"

class ProposalService {
    getAllEvents() {
        return axios.get(EVENT_API_URL + "GetAllNewEvents", { headers: authHeader() })
    }
    createNewEvent(event) {
        return axios.post(EVENT_API_URL + "CreateNewEvent", event, { headers: authHeader() })
    }
    updateEvent(id, event) {
        return axios.put(EVENT_API_URL + "UpdateEvent?id=" + id, event, { headers: authHeader() })
    }

}

export default new ProposalService();