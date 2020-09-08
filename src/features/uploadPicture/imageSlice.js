import { createSlice } from '@reduxjs/toolkit';
import * as authAPI from '../../app/api/image';

const initialState = {
    uploadPending: false,
    downloadPending: false, 
    uploadSuccess: false,
    downloadSuccess: false, 
    uploadError: false, 
    downloadError: false,
    uploaded: {},
    srcMap: {}
  }

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    downloadPending: (state) =>  ({ ...state, downloadPending: true, downloadSuccess: false, downloadError: false}),
    downloadSuccess: (state, action) =>  { 
      state.downloadPending= false;
      state.downloadSuccess= true;
      state.downloadError= false;
      state.srcMap[action.payload.id]= {...state.srcMap[action.payload.id], src: action.payload.src}
    },
    downloadError: (state, action) =>  ({ ...state, downloadPending: false, downloadSuccess: false, downloadError: action.payload}),
    uploadPending: (state) =>  ({ ...state, uploadPending: true, uploadSuccess: false, uploadError: false}),
    uploadSuccess: (state, action) => { 
        state.uploadPending= false; 
        state.uploadSuccess= true;
        state.uploaded= action.payload;
        state.uploadError= false;
        state.srcMap[action.payload.img]= action.payload;
      },
    uploadError: (state, action) => ({ ...state, uploadPending: false, uploadSuccess: false, uploadError: action.payload}),
    reset: (state) => ({...initialState, srcMap: state.srcMap})
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

export const uploadImage = (imageFile) => dispatch => {
    dispatch(uploadPending());
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("documentType", "crash");
    return authAPI.uploadImage(formData)
    .then( res => {
      const reader = new FileReader();
      try{
        reader.addEventListener("load", function () {
          let src = reader.result;
          dispatch(uploadSuccess({...res.data, src }));
        }, false);
        reader.readAsDataURL(imageFile);
      }catch(e){
        console.error(e);
        let responseError = { FE_CODE: "ERR_UPLOAD_FILE_READER" };
        dispatch(uploadError(responseError));
      }  
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
