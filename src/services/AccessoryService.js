import axios from 'axios';

const GET_ALL_ACCESSORIES_API_URL = "https://carworld.cosplane.asia/api/accessory/GetAllAccessories"

class AccessoryService {
    getAccessories() {
        return axios.get(GET_ALL_ACCESSORIES_API_URL);
    }
}

export default new AccessoryService();