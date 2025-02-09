import FetchConfig from "./fetch.config";
import { Redirect } from 'expo-router';

const { headers, baseUrl, methods } = FetchConfig;


const get = async ({ url, timeout }: { url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout && timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            headers,
            signal: timeout ? signal : null
        });

        timeout && clearTimeout(fetchTimeout);

        const data = await response.json();
        return data;
    } catch (error) {
        if ((error as any)?.name === 'AbortError') {
            console.error('Fetch request timed out');
            return { code: 400, msg: 'Fetch request timed out' }
        } else {
            console.error('Fetch request error:', error);
            return { code: 500, msg: 'Fetch request errorout' }
        }
    }
}

const getWithBearerToken = async ({ token, url, timeout = 20000 }: { token: string, url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    // const fetchTimeout = setTimeout(() => {
    //     controller.abort();
    // }, timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            headers: {
                ...headers,
                credentials: 'include',
                Authorization: `Bearer ${token}`
            },
            // signal
        });

        // timeout && clearTimeout(fetchTimeout);

        const data = await response.json();

        if (data?.msg === 'jwt malformed' && data?.code === 401) {
            // signOut();
            <Redirect href="/(auth)/signin" />;
        }
        else return data;
    } catch (error) {
        console.log({ error })
        // if ((error as any)?.name === 'AbortError') {
        //     console.error('Fetch request timed out');
        //     return { code: 400, msg: 'Fetch request timed out' }
        // } else {
        //     console.error('Fetch request error:', error);
        //     return { code: 500, msg: 'Fetch request errorout' }
        // }
    }
}

const post = async ({ data: formData, url, timeout = 20000 }: { data?: object, url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: methods.POST,
            headers,
            // signal,
            body: JSON.stringify(formData)
        });
        // timeout && clearTimeout(fetchTimeout);

        const data = await response.json();
        return data;
    } catch (error) {
        console.log({ error })
        // if ((error as any)?.name === 'AbortError') {
        //     console.error('Fetch request timed out');
        //     return { code: 400, msg: 'Fetch request timed out' }
        // } else {
        //     console.error('Fetch request error:', error);
        //     return { code: 500, msg: 'Fetch request errorout' }
        // }
    }
}

const postWithBearerToken = async ({ data: formData, url, token, timeout = 20000 }: { token: string, url: string, data?: object, timeout?: number }) => {
    console.log({ formData })
    const controller = new AbortController();
    const signal = controller.signal;

    // const fetchTimeout = setTimeout(() => {
    //     controller.abort();
    // }, timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: methods.POST,
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            },
            // signal,
            body: JSON.stringify(formData)
        });
        // timeout && clearTimeout(fetchTimeout);

        const data = await response.json();
        // if (data?.msg === 'jwt malformed' && data?.code === 401) {
        //     // signOut();
        //     <Redirect href="/(auth)/signin" />;
        // }
        // else
        return data;
    } catch (error) {
        // if ((error as any)?.name === 'AbortError') {
        //     console.error('Fetch request timed out');
        //     return { code: 400, msg: 'Fetch request timed out' }
        // } else {
        //     console.error('Fetch request error:', error);
        //     return { code: 500, msg: 'Fetch request errorout' }
        // }
        console.log({ error })
    }
}

const patchWithBearerToken = async ({ data: formData, url, token, timeout = 20000 }: { token: string, url: string, data?: object, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    // const fetchTimeout = setTimeout(() => {
    //     controller.abort();
    // }, timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: methods.PATCH,
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            },
            // signal,
            body: formData ? JSON.stringify(formData) : null
        });
        // timeout && clearTimeout(fetchTimeout);

        const data = await response.json();
        // if (data?.msg === 'jwt malformed' && data?.code === 401) {
        //     // signOut();
        //     <Redirect href="/(auth)/signin" />;
        // }
        // else
        return data;
    } catch (error) {
        // if ((error as any)?.name === 'AbortError') {
        //     console.error('Fetch request timed out');
        //     return { code: 400, msg: 'Fetch request timed out' }
        // } else {
        //     console.error('Fetch request error:', error);
        //     return { code: 500, msg: 'Fetch request errorout' }
        // }
        console.log({ error })
    }
}


const FetchService = {
    post, get,
    getWithBearerToken,
    postWithBearerToken,
    patchWithBearerToken
}

export default FetchService;