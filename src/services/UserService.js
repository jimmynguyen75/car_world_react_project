import axios from 'axios';

const ACCOUNTS_API_URL = "https://reqres.in/api/users";

class UserService  {
    getTotalUsers() {
        return axios.get(ACCOUNTS_API_URL);
    } 
}

export default new UserService();