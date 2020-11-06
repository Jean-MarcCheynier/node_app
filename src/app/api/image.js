import  {default as  axios } from './axios';

export const uploadImage = (requestBody) => axios.post('/api/image', requestBody, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
export const downloadImage = (imageId) => axios.get(`/api/image/${imageId}`, {
    responseType:'arraybuffer'
});



