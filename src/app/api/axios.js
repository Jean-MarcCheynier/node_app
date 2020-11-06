import axios from 'axios';

const APIKit = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 6000,
    headers: {
        'Custom-Type': 'application/json',
    } 
});

export const setToken = token => {
    console.log(token);
    APIKit.defaults.headers.common['Authorization'] = token;
}

export default APIKit;