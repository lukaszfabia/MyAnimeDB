import { ACCESS_TOKEN } from "../constants/const";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem(ACCESS_TOKEN) ? localStorage.getItem(ACCESS_TOKEN) : sessionStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

export default api;