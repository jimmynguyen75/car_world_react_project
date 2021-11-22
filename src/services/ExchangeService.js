import axios from "axios";
import authHeader from './AuthHeader'

const Exchange_URL = 'https://carworld.cosplane.asia/api/exchange/'

class ExchangeService {
    getExchangeById(id) {
        return axios.get(Exchange_URL + "GetExchangeById?id=" + id, { headers: authHeader() })
    }
}
export default new ExchangeService()