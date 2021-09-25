import axios from "axios";
import authHeader from './AuthHeader'

const BRAND_API_URL = "https://carworld.cosplane.asia/api/brand/"

class BrandService {
    getAllBrand() {
        return axios.get(BRAND_API_URL + "GetAllBrandsOfCar", { headers: authHeader() })
    }
    getAllAccessoriesBrand() {
        return axios.get(BRAND_API_URL + "GetAllBrandsOfAccessory", { headers: authHeader() })
    }
}

export default new BrandService();