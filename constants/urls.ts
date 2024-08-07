
const NODE_ENV: 'development' | 'production' = 'development';
const DEPLOYED_API_URL = 'https://tfare-api.onrender.com';
const IP_ADDRESS = '172.20.10.4';
const LOCAL_AP_URL = `http://${IP_ADDRESS}:3000/api/v0`;
const baseUrl = NODE_ENV === 'development' ? LOCAL_AP_URL : DEPLOYED_API_URL;

const URLS = {
    baseUrl,
}

export default URLS;

//  ! Expo deosn;t support env file ATM
// const NODE_ENV: 'development' | 'production' = process.env.NODE_ENV as 'development' | 'production';
// const DEPLOYED_API_URL = process.env.DEPLOYED_API_URL;
// const IP_ADDRESS = '172.20.10.4';
// const LOCAL_AP_URL = `http://${IP_ADDRESS}:3000/api/v0`;
// const baseUrl = NODE_ENV === 'development' ? LOCAL_AP_URL : DEPLOYED_API_URL;
//  ! Expo deosn;t support env file ATM
