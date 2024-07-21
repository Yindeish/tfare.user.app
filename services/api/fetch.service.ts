import FetchConfig from "./fetch.config";

const { headers, baseUrl, methods } = FetchConfig;

const get = async ({ url, timeout = 10000 }: { url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers,
            signal
        });

        clearTimeout(fetchTimeout);

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

const getWithBearerToken = async ({ token, url, timeout = 10000 }: { token: string, url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            },
            signal
        });
        clearTimeout(fetchTimeout);

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

const post = async ({ data: formData, url, timeout = 10000 }: { data?: object, url: string, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: methods.POST,
            headers,
            signal,
            body: JSON.stringify(formData)
        });
        clearTimeout(fetchTimeout);

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

const postWithBearerToken = async ({ data: formData, url, token, timeout = 10000 }: { token: string, url: string, data?: object, timeout?: number }) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        const response = await fetch(`${baseUrl}/${url}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`
            },
            signal,
            body: JSON.stringify(formData)
        });
        clearTimeout(fetchTimeout);

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


const FetchService = {
    post, get,
    getWithBearerToken,
    postWithBearerToken,
}

export default FetchService;