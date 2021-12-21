import axios from 'axios';
import authHeader from './AuthHeader'

const ACCESSORIES_API_URL = "https://carworld.cosplane.asia/api/accessory/"

class AccessoryService {
    getAccessories() {
        return axios.get(ACCESSORIES_API_URL + "GetAllAccessories", { headers: authHeader() });
    }
    getAccessoriesById(id) {
        return axios.get(ACCESSORIES_API_URL + "GetAllAccessoryById/" + id, { headers: authHeader() });
    }
    deleteAccessoryById(id) {
        return axios.delete(ACCESSORIES_API_URL + "RemoveAccessory?id=" + id, { headers: authHeader() });
    }
    createNewAccessory(accessory) {
        return axios.post(ACCESSORIES_API_URL + "CreateNewAccessory", accessory, { headers: authHeader() });
    }
    updateAccessoryById(id, accessory) {
        return axios.put(ACCESSORIES_API_URL + "UpdateAccessory?id=" + id, accessory, { headers: authHeader() });
    }
}

export default new AccessoryService();