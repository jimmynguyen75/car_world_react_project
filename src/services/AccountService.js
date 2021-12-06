import axios from 'axios';
import authHeader from './AuthHeader'

const ACCOUNTS_API_URL = "https://carworld.cosplane.asia/api/user/"

const login = (username, password, token) => {
    return axios
        .post(ACCOUNTS_API_URL + "LoginAdmin", {
            username,
            password,
            token,
            headers: authHeader()
        })
        .then((response) => {
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
}

const updateProfile = (id, user) => {
    return axios
        .put(ACCOUNTS_API_URL + "UpdateProfile?id=" + id, user, { headers: authHeader() });
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

const getUserById = (id) => {
    return axios
        .get(ACCOUNTS_API_URL + "GetUserById?id=" + id, { headers: authHeader() });
}

const logOut = () => {
    localStorage.removeItem("user");
}

const getAllUser = () => {
    return axios.get(ACCOUNTS_API_URL + "GetAllUsers", { headers: authHeader() })
}

const getAdminAndManger = () => {
    return axios.get(ACCOUNTS_API_URL + "GetAllAdminsAndManagers", { headers: authHeader() })
}

const changeAccountStatus = (id, status) => {
    return axios.put(ACCOUNTS_API_URL + "ChangeAccountStatus?id=" + id + "&status=" + status, { headers: authHeader() })
}

const updateRole = (id, role) => {
    return axios.put(ACCOUNTS_API_URL + "UpdateRole?id=" + id + "&userRole=" + role, { headers: authHeader() })
}

const createAccount = (account) => {
    return axios.post(ACCOUNTS_API_URL + "CreateNewAccount", account, { headers: authHeader() })
}

const object = {
    login, getCurrentUser, logOut, getUserById, updateProfile, getAllUser, getAdminAndManger, changeAccountStatus, updateRole, createAccount
}
export default object;