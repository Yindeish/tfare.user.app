import URLS from '@/constants/urls';

const { baseUrl } = URLS;

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

const methods = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
}

const FetchConfig = {
    headers,
    baseUrl,
    methods
}

export default FetchConfig;

