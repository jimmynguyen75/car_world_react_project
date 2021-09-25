import axios from 'axios'
import authHeader from './AuthHeader'

const CARS_API_URL = "https://carworld.cosplane.asia/api/car/"

class CarService {
    getCars() {
        return axios.get(CARS_API_URL + "GetAllCars", { headers: authHeader() });
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
