import { createSlice } from '@reduxjs/toolkit';
import * as authAPI from '../../app/api/image';

const initialState = {
    pending: false, 
    success: false, 
    error: false,
    srcMap: {}
  }

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    downloadPending: (state) =>  ({ ...state, pending: true, success: false, error: false}),
    downloadSuccess: (state, action) =>  { 
      state.pending= false;
      state.success= true;
      state.error= false;
      state.srcMap[action.payload.id]= action.payload.src
    },
    downloadError: (state, action) =>  ({ ...state, pending: false, success: false, error: action.payload}),
    uploadPending: (state) =>  ({ ...state, pending: true, success: false, error: false}),
    uploadSuccess: (state, action) =>  ({ 
        ...state,
        pending: false, 
        success: action.payload._id,
        error: false}),
    uploadError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload}),
    reset: () => ({...initialState})
  },
});

export const { uploadPending, 
  uploadSuccess, 
  uploadError, 
  clearForm,
  downloadPending, 
  downloadSuccess, 
  downloadError,
  reset } = imageSlice.actions;

export const uploadImage = (image) => dispatch => {
    dispatch(uploadPending());
    authAPI.uploadImage(image)
    .then( res => {
      dispatch(uploadSuccess(res.data))
    })
    .catch( error => {
      let responseError = { FE_CODE: "ERR_UPLOAD" };
      if(error.response){
        const {status, data} = error.response;
        responseError = { ...responseError, status, data}
      }
      dispatch(uploadError(responseError));
    })
};

export const downloadImage = (imageId) => dispatch => {
  dispatch(downloadPending());
  return authAPI.downloadImage(imageId)
  .then( res => {
    console.log("downloadImage1");
    console.log(res);
    const base64 = btoa(
      new Uint8Array(res.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );
    const imgSrc = { 
      id: imageId,
      src: `data:;base64,${base64}`
    }
   
    console.log(imgSrc);

    dispatch(downloadSuccess(imgSrc))
  })
  .catch( error => {
    let responseError = { FE_CODE: "ERR_DOWNLOAD" };
    if(error.response){
      const {status, data} = error.response;
      responseError = { ...responseError, status, data}
    }
    dispatch(downloadError(responseError));
  })
};


export default imageSlice.reducer;
