const DEPLOYED_API_URL = 'https://tfare-api.onrender.com/api/v0';
const IP_ADDRESS = '172.20.10.4';
const LOCAL_AP_URL = `http://${IP_ADDRESS}:3000/api/v0`;
const SOCKETIO_URL = `http://${IP_ADDRESS}:3001`;
// const SOCKETIO_URL = `http://localhost:3001`;
// let baseUrl = LOCAL_AP_URL;
let baseUrl = DEPLOYED_API_URL;

const URLS = {
    baseUrl,
    SOCKETIO_URL
}

export default URLS;