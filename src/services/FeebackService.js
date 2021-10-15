import axios from "axios";
import authHeader from './AuthHeader'

const FEEDBACK_URL = 'https://carworld.cosplane.asia/api/feedback/'

class FeedbackService {
    getContests() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=1', { headers: authHeader() })
    }
    getEvents() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=2', { headers: authHeader() })
    }
    getExchangeCars() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=3', { headers: authHeader() })
    }
    getExchangeAccessories() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=4', { headers: authHeader() })
    }
    getExchangeResponse() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=5', { headers: authHeader() })
    }
    getFeedbackById(id) {
        return axios.get(FEEDBACK_URL + 'GetFeedbackById?id=' + id, { headers: authHeader() })
    }
}
export default new FeedbackService()