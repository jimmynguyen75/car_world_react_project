import axios from 'axios';

const ACCOUNTS_API_URL = "https://reqres.in/api/users";

const login = (email, first_name) => {
    return axios
        .post(ACCOUNTS_API_URL, {
            email,
            first_name,
        })
        .then((response) => {
            if (response.data.first_name) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const logOut = () => {
    localStorage.removeItem("user");
}

export default { login, getCurrentUser, logOut };