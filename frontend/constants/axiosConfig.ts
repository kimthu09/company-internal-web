import axios from 'axios';
import { endpoint } from '.';
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: endpoint,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
