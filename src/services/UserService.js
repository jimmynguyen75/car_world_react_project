import axios from 'axios';

const USERS_REST_API = '';

class UserService {
    getUsers() {
        return axios.get(USERS_REST_API);
    }
}

export default new UserService();