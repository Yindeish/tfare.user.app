import { AxiosRequestConfig } from "axios";
import AxiosConfig from "./fetch.config";

const { axios } = AxiosConfig;

const get = async ({ url }: { url: string }) => {
    try {
        const response = await axios
            .get(url);

        console.log('response.data', response.data);
        return response.data
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const getWithBearerToken = async ({ token }: { token: string }) => {
    try {
        const response = await axios
            .get('/endpoint', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        console.log('response.data', response.data);
        return response.data
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const post = async ({ data, url }: { data?: object, url: string }) => {
    try {
        const response = await axios
            .post(url, data);
        console.log('response.data', response.data);
        return response.data
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const postWithBearerToken = async ({ data, url, token }: { token: string, url: string, data: object }) => {
    try {
        const response = await axios
            .post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        console.log('response.data', response.data);
        return response.data
    } catch (error) {
        console.error('error', error);
        return error;
    }
}


const AxiosService = {
    post, get,
    getWithBearerToken,
    postWithBearerToken,
}

export default AxiosService;