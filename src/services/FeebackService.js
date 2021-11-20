import axios from "axios";
import authHeader from './AuthHeader'

const FEEDBACK_URL = 'https://carworld.cosplane.asia/api/feedback/'
const CE = 'https://carworld.cosplane.asia/api/contestEvent/'

class FeedbackService {
    getCE() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=1', { headers: authHeader() })
    }
    getExchange() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=2', { headers: authHeader() })
    }
    getExchangeResponse() {
        return axios.get(FEEDBACK_URL + 'GetFeedbacksByType?type=3', { headers: authHeader() })
    }
    getFeedbackById(id) {
        return axios.get(FEEDBACK_URL + 'GetFeedbackById?id=' + id, { headers: authHeader() })
    }
    replyFeedback(id, content) {
        return axios.put(FEEDBACK_URL + 'ReplyFeedback?id=' + id, content, { headers: authHeader() })
    }
    getCEById(id) {
        return axios.get(CE + 'GetCEById?id=' + id, { headers: authHeader() })
    }
}
export default new FeedbackService()