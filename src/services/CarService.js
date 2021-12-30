import axios from 'axios'
import authHeader from './AuthHeader'

const CARS_API_URL = "https://carworld.cosplane.asia/api/car/"
const ATTRIBUTE_API_URL = "https://carworld.cosplane.asia/api/attribution/"
const ENGINE_API_URL = "https://carworld.cosplane.asia/api/engineType/"
const CARS_MODEL_URL = "https://carworld.cosplane.asia/api/carModel/"
const CARS_GENERATION_URL = "https://carworld.cosplane.asia/api/generation/"
const CARS_WITH_ATTRIBUTE_URL = "https://carworld.cosplane.asia/api/genAtt/"
class CarService {
    getCars() {
        return axios.get(CARS_API_URL + "GetAllCars", { headers: authHeader() });
    }
    createNewCar(car) {
        return axios.post(CARS_API_URL + "CreateNewCar", car, { headers: authHeader() });
    }
    deleteCar(id) {
        return axios.delete(CARS_API_URL + "RemoveCar?id=" + id, { headers: authHeader() });
    }
    updateCar(id, car) {
        return axios.put(CARS_API_URL + "UpdateCar?id=" + id, car, { headers: authHeader() });
    }
    //ENGINE
    createEngineType(engineType) {
        return axios.post(ENGINE_API_URL + "CreateEngineType?name=" + engineType, { headers: authHeader() });
    }
    getEngineType() {
        return axios.get(ENGINE_API_URL + "GetEngineTypes", { headers: authHeader() });
    }
    updateEngineType(id, name) {
        return axios.put(ENGINE_API_URL + "UpdateEngineType?id=" + id + "&name=" + name, { headers: authHeader() });
    }
    deleteEngineType(id) {
        return axios.delete(ENGINE_API_URL + "RemoveEngineType?id=" + id, { headers: authHeader() });
    }
    // ATTRIBUTE
    createAttribute(attributes) {
        return axios.post(ATTRIBUTE_API_URL + "CreateNewAttribution", attributes, { headers: authHeader() })
    }
    getAttributeByTypeId(id) {
        return axios.get(ATTRIBUTE_API_URL + "GetAttsByEngineType?typeId=" + id, { headers: authHeader() })
    }
    updateAttributeId(id, attribute) {
        return axios.put(ATTRIBUTE_API_URL + "UpdateAttribution?id=" + id, attribute, { headers: authHeader() })
    }
    deleteAttributeById(id) {
        return axios.delete(ATTRIBUTE_API_URL + "RemoveAttribution?id=" + id, { headers: authHeader() })
    }
    //CARMODEL
    createCarModel(models) {
        return axios.post(CARS_MODEL_URL + "CreateCarModel", models, { headers: authHeader() })
    }
    getCarModels() {
        return axios.get(CARS_MODEL_URL + "GetAllCarModels", { headers: authHeader() })
    }
    getCarModelsByBrand(id) {
        return axios.get(CARS_MODEL_URL + "GetAllCarModelsByBrand?brandId=" + id, { headers: authHeader() })
    }
    updateCarModel(id, model) {
        return axios.put(CARS_MODEL_URL + "UpdateCarModel?id=" + id, model, { headers: authHeader() })
    }
    deleteCarModel(id) {
        return axios.delete(CARS_MODEL_URL + "RemoveCarModel?id=" + id, { headers: authHeader() })
    }
    //GENERATION
    createGeneration(generation) {
        return axios.post(CARS_GENERATION_URL + "CreateGeneration", generation, { headers: authHeader() })
    }
    getGenerationByCarModel(id) {
        return axios.get(CARS_GENERATION_URL + "GetAllGenerationsByCarModel?carModelId=" + id, { headers: authHeader() })
    }
    updateCarGeneration(id, generation) {
        return axios.put(CARS_GENERATION_URL + "UpdateGeneration?id=" + id, generation, { headers: authHeader() })
    }
    deleteCarGeneration(id) {
        return axios.delete(CARS_GENERATION_URL + "RemoveGeneration?id=" + id, { headers: authHeader() })
    }
    //CARWITHATTRIBUTE
    createCarWithAttribute(attributes) {
        return axios.post(CARS_WITH_ATTRIBUTE_URL + "CreateCarWithAtts", attributes, { headers: authHeader() })
    }
    getCarWithAttributeByGenerationId(id) {
        return axios.get(CARS_WITH_ATTRIBUTE_URL + "GetGenerationWithAtts?generationId=" + id, { headers: authHeader() })
    }
    deleteCarWithAttributesByGenerationId(id) {
        return axios.delete(CARS_WITH_ATTRIBUTE_URL + "RemoveGenWithAtts?generationId=" + id, { headers: authHeader() })
    }
}

export default new CarService();

    // const [cars, setCars] = useState([])

    // useEffect(() => {
    //     axios
    //         .get('https://jsonplaceholder.typicode.com/albums')
    //         .then(res => {
    //             console.log(res)
    //             setCars(res.data)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // })

    // return (
    //     <div>
    //         <ul>
    //             {cars.map(car => (
    //                 <li key={car.id}>{car.title}</li>
    //             ))}
    //         </ul>
    //     </div>
    // )
