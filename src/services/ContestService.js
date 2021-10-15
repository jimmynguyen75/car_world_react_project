import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';

const CONTEST_API_URL = "https://carworld.cosplane.asia/api/contest/"
const USERCONTEST_API_URL = "https://carworld.cosplane.asia/api/userContest/"

class ContestService {
    getAllContests() {
        return axios.get(CONTEST_API_URL + "GetNewContests?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    createNewContest(contest) {
        return axios.post(CONTEST_API_URL + "CreateNewContest", contest, { headers: authHeader() })
    }
    updateContest(id, contest) {
        return axios.put(CONTEST_API_URL + "UpdateContest?id=" + id, contest, { headers: authHeader() })
    }
    getPreparedContests() {
        return axios.get(CONTEST_API_URL + "GetPreparedContests?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getOngoingContests() {
        return axios.get(CONTEST_API_URL + "GetOngoingContests?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getFinishedContests() {
        return axios.get(CONTEST_API_URL + "GetFinishedContests?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getCanceledContest() {
        return axios.get(CONTEST_API_URL + "GetCanceledContests", { headers: authHeader() })
    }
    cancelContest(id) {
        return axios.put(CONTEST_API_URL + "CancelContest?id=" + id, { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(USERCONTEST_API_URL + "GetContestsJoined?userId=" + id, { headers: authHeader() })
    }
    checkUser(user) {
        return axios.put(USERCONTEST_API_URL + "CheckInUser", user, { headers: authHeader() })
    }
}

export default new ContestService();
