import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';

const CONTEST_API_URL = "https://carworld.cosplane.asia/api/contestEvent/"
const USERCONTEST_API_URL = "https://carworld.cosplane.asia/api/ceRegister/"
const CONTEST_PRIZE = "https://carworld.cosplane.asia/api/contestPrize/"

class ContestService {
    getAllContests() {
        return axios.get(CONTEST_API_URL + "GetRegisterCEsWeb?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    createNewContest(contest) {
        return axios.post(CONTEST_API_URL + "CreateCE", contest, { headers: authHeader() })
    }
    updateContest(id, contest) {
        return axios.put(CONTEST_API_URL + "UpdateCE?id=" + id, contest, { headers: authHeader() })
    }
    getPreparedContests() {
        return axios.get(CONTEST_API_URL + "GetPreparedCEsWeb?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getOngoingContests() {
        return axios.get(CONTEST_API_URL + "GetOngoingCEsWeb?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getFinishedContests() {
        return axios.get(CONTEST_API_URL + "GetFinishedCEsWeb?type=2&now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getCanceledContest() {
        return axios.get(CONTEST_API_URL + "GetCanceledCEs?type=2", { headers: authHeader() })
    }
    cancelContest(id, reason) {
        return axios.put(CONTEST_API_URL + "CancelCE?id=" + id + "&reason=" + reason, { headers: authHeader() })
    }
    getContestByMonth() {
        return axios.get(CONTEST_API_URL + "CountCEsByMonth?type=2&date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(USERCONTEST_API_URL + "GetUsersInCE?contestEventId=" + id, { headers: authHeader() })
    }
    checkUser(status, user) {
        return axios.put(USERCONTEST_API_URL + "CheckInUser?status=" + status, user, { headers: authHeader() })
    }
    //beforeFinished
    getAllContestPrize() {
        return axios.get(CONTEST_API_URL + "GetAllContestPrizes?now=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    ////
    getCheckedAttendance(id) {
        return axios.get(CONTEST_PRIZE + "GetJoinedUsers?contestEventId=" + id, { headers: authHeader() })
    }
}

export default new ContestService();
