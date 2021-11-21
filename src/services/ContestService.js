import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';

const CONTEST_API_URL = "https://carworld.cosplane.asia/api/contestEvent/"
const USERCONTEST_API_URL = "https://carworld.cosplane.asia/api/ceRegister/"

class ContestService {
    getAllContests() {
        return axios.get(CONTEST_API_URL + "GetNewCEs?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    createNewContest(contest) {
        return axios.post(CONTEST_API_URL + "CreateCE", contest, { headers: authHeader() })
    }
    updateContest(id, contest) {
        return axios.put(CONTEST_API_URL + "UpdateCE?id=" + id, contest, { headers: authHeader() })
    }
    getPreparedContests() {
        return axios.get(CONTEST_API_URL + "GetPreparedCEs?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getOngoingContests() {
        return axios.get(CONTEST_API_URL + "GetOngoingCEs?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getFinishedContests() {
        return axios.get(CONTEST_API_URL + "GetFinishedCEs?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getCanceledContest() {
        return axios.get(CONTEST_API_URL + "GetCanceledCEs?type=2", { headers: authHeader() })
    }
    cancelContest(id) {
        return axios.put(CONTEST_API_URL + "CancelCE?id=" + id, { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(USERCONTEST_API_URL + "GetUsersInCE?contestEventId=" + id, { headers: authHeader() })
    }
    checkUser(user) {
        return axios.put(USERCONTEST_API_URL + "CheckInUser?status=", user, { headers: authHeader() })
    }
    //beforeFinished
    getAllContestPrize() {
        return axios.get(CONTEST_API_URL + "GetAllContestPrizes?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
}

export default new ContestService();
