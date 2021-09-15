import axios from 'axios';

const ACCOUNTS_API_URL = "https://fakestoreapi.com/auth/login";

const login = (username, password) => {
    return axios
        .post(ACCOUNTS_API_URL, {
            username,
            password
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("accessToken", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const getCurrentUser = () => {
};

const logOut = () => {
    localStorage.removeItem("user");
}

export default { login, getCurrentUser, logOut };