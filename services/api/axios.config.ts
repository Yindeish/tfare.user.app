import URLS from '@/constants/urls';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: URLS.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
// axiosInstance.interceptors.request.use(
//     config => {
//         // Do something before the request is sent, like adding an Authorization header
//         const token = 'YOUR_AUTH_TOKEN'; // Replace with logic to get the auth token if needed
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         // Do something with the request error
//         return Promise.reject(error);
//     }
// );
// Request interceptor

// Response interceptor
// axiosInstance.interceptors.response.use(
//     response => {
//         // Do something with the response data
//         return response;
//     },
//     error => {
//         // Do something with the response error
//         return Promise.reject(error);
//     }
// );
// Response interceptor

const AxiosConfig = {
    axios: axiosInstance
}

export default AxiosConfig;

