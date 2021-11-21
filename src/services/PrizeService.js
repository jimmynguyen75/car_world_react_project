import axios from "axios";
import authHeader from './AuthHeader'
const PRIZE_API_URL = "https://carworld.cosplane.asia/api/prize/"
const PRIZE_CONTEST_URL = "https://carworld.cosplane.asia/api/contestPrize/"
class PrizeService {
    ///alll
    createPrize(prize) {
        return axios.post(PRIZE_API_URL + "CreateNewPrize", prize, { headers: authHeader() })
    }
    getPrizes() {
        return axios.get(PRIZE_API_URL + "GetAllPrizes", { headers: authHeader() })
    }
    getPrizeById(id) {
        return axios.get(PRIZE_API_URL + "GetPrizeById?id=" + id, { headers: authHeader() })
    }
    updatePrize(id, prize) {
        return axios.put(PRIZE_API_URL + "UpdatePrize?id=" + id, prize, { headers: authHeader() })
    }
    removePrizeById(id) {
        return axios.put(PRIZE_API_URL + "RemovePrize?id=" + id, { headers: authHeader() })
    }
    ///Prize Contest
    createPrizeContest(prizeContest) {
        return axios.post(PRIZE_CONTEST_URL + "CreatePrizeForContest", prizeContest, { headers: authHeader() })
    }
     getPrizeContestById(id) {
        return axios.get(PRIZE_CONTEST_URL + "GetPrizesByContestId?contestId=" + id, { headers: authHeader() })
    }
    updatePrizeContest(id, prizeContest) {
        return axios.put(PRIZE_CONTEST_URL + "UpdatePrizeForContest?id=" + id, prizeContest, { headers: authHeader() })
    }
    getUserJoined(id) {
        return axios.get(PRIZE_CONTEST_URL + "GetJoinedUsers?contestEventId=" + id, { headers: authHeader() })
    }
    givePrizeToUser(prizeId, userId) {
        return axios.put(PRIZE_CONTEST_URL + "GivePrizeToUser?id=" + prizeId + "&userId=" + userId, { headers: authHeader() })
    }
    removePrizeContest(id) {
        return axios.delete(PRIZE_CONTEST_URL + "RemovePrizeForContest?id=" + id, { headers: authHeader() })
    }
}

export default new PrizeService();