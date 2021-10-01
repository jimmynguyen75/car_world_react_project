import axios from "axios";
import authHeader from './AuthHeader'

const BRAND_API_URL = "https://carworld.cosplane.asia/api/brand/"

class BrandService {
    getAllBrand() {
        return axios.get(BRAND_API_URL + "GetAllBrandsOfCar", { headers: authHeader() })
    }
    getBrands() {
        return axios.get(BRAND_API_URL + "GetAllBrands", { headers: authHeader() })
    }
    getAllAccessoriesBrand() {
        return axios.get(BRAND_API_URL + "GetAllBrandsOfAccessory", { headers: authHeader() })
    }
    createNewBrand(brand) {
        return axios.post(BRAND_API_URL + "CreateNewBrand", brand, { headers: authHeader() })
    }
    updateBrand(id, brand) {
        return axios.put(BRAND_API_URL + "UpdateBrand?id=" + id, brand, { headers: authHeader() })
    }
    deleteBrand(id) {
        return axios.put(BRAND_API_URL + "RemoveBrand?id=" + id, { headers: authHeader() })
    }
}

export default new BrandService();