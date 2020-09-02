import  {default as  axios } from './axios';

export const fetchUsers = () => axios.get('/api/user');
export const updateUser = (userId, userData) => axios.put(`api/user/${userId}`, userData);
export const deleteUser = (userId) => axios.delete(`api/user/${userId}`);
