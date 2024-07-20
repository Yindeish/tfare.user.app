import FetchConfig from "./fetch.config";

const { headers, baseUrl, methods } = FetchConfig;

const get = async ({ url }: { url: string }) => {
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const getWithBearerToken = async ({ token, url }: { token: string, url: string }) => {
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const post = async ({ data: formData, url }: { data?: object, url: string }) => {
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: methods.POST,
            headers,
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error', error);
        return error;
    }
}

const postWithBearerToken = async ({ data: formData, url, token }: { token: string, url: string, data?: object }) => {
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error', error);
        return error;
    }
}


const FetchService = {
    post, get,
    getWithBearerToken,
    postWithBearerToken,
}

export default FetchService;