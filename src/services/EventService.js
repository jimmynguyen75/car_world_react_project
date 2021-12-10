import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';
const EVENT_API_URL = "https://carworld.cosplane.asia/api/contestEvent/"
const USEREVENT_API_URL = "https://carworld.cosplane.asia/api/ceRegister/"

class EventService {
    getAllEvents() {
        return axios.get(EVENT_API_URL + "GetNewCEs?type=1&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    createNewEvent(event) {
        return axios.post(EVENT_API_URL + "CreateCE", event, { headers: authHeader() })
    }
    updateEvent(id, event) {
        return axios.put(EVENT_API_URL + "UpdateCE?id=" + id, event, { headers: authHeader() })
    }
    getPreparedEvents() {
        return axios.get(EVENT_API_URL + "GetPreparedCEs?type=1&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getOngoingEvents() {
        return axios.get(EVENT_API_URL + "GetOngoingCEsWeb?type=1&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getFinishedEvents() {
        return axios.get(EVENT_API_URL + "GetFinishedCEs?type=1&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getCanceledEvent() {
        return axios.get(EVENT_API_URL + "GetCanceledCEs?type=1", { headers: authHeader() })
    }
    cancelEvent(id, reason) {
        return axios.put(EVENT_API_URL + "CancelCE?id=" + id + "&reason=" + reason, { headers: authHeader() })
    }
    getEventByMonth() {
        return axios.get(EVENT_API_URL + "CountCEsByMonth?type=1&date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(USEREVENT_API_URL + "GetUsersInCE?contestEventId=" + id, { headers: authHeader() })
    }
    checkUser(status, user) {
        return axios.put(USEREVENT_API_URL + "CheckInUser?status=" + status, user, { headers: authHeader() })
    }
}

export default new EventService();