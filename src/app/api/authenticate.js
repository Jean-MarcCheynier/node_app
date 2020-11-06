import  {default as  axios } from './axios';

export const signup = (requestBody) => axios.post('/signup', requestBody);
export const signin = (requestBody) => axios.post('/signin', requestBody);



