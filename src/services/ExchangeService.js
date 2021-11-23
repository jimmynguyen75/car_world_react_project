import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';
const Exchange_URL = 'https://carworld.cosplane.asia/api/exchange/'

class ExchangeService {
    getExchangeById(id) {
        return axios.get(Exchange_URL + "GetExchangeById?id=" + id, { headers: authHeader() })
    }
    getExchangeCarByMonth() {
        return axios.get(Exchange_URL + "CountExchangesByMonth?type=1&date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getExchangeAccessoryByMonth() {
        return axios.get(Exchange_URL + "CountExchangesByMonth?type=2&date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
    getTopExchangeByMonth() {
        return axios.get(Exchange_URL + "GetTopExCarBrandsByMonth?date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
}
export default new ExchangeService()