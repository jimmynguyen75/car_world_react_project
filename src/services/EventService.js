import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';
const EVENT_API_URL = "https://carworld.cosplane.asia/api/event/"
const USEREVENT_API_URL = "https://carworld.cosplane.asia/api/userEvent/"

class EventService {
    getAllEvents() {
        return axios.get(EVENT_API_URL + "GetNewEvents?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    createNewEvent(event) {
        return axios.post(EVENT_API_URL + "CreateNewEvent", event, { headers: authHeader() })
    }
    updateEvent(id, event) {
        return axios.put(EVENT_API_URL + "UpdateEvent?id=" + id, event, { headers: authHeader() })
    }
    getPreparedEvents() {
        return axios.get(EVENT_API_URL + "GetPreparedEvents?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getOngoingEvents() {
        return axios.get(EVENT_API_URL + "GetOngoingEvents?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getFinishedEvents() {
        return axios.get(EVENT_API_URL + "GetFinishedEvents?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getCanceledEvent() {
        return axios.get(EVENT_API_URL + "GetCanceledEvents", { headers: authHeader() })
    }
    cancelEvent(id) {
        return axios.put(EVENT_API_URL + "CancelEvent?id=" + id, { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(USEREVENT_API_URL + "GetUsersInEvent?eventId=" + id, { headers: authHeader() })
    }
    checkUser(user) {
        return axios.put(USEREVENT_API_URL + "CheckInUser", user, { headers: authHeader() })
    }
}

export default new EventService();