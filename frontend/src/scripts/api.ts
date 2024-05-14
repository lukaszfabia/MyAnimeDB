import { ACCESS_TOKEN } from "../constants/const";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
    (config) => {
        const myToken = localStorage.getItem(ACCESS_TOKEN);
        console.log(myToken)
        if (myToken) {
            config.headers['Authorization'] = `Bearer ${myToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

export default api;