import { createSlice } from '@reduxjs/toolkit';
import * as authAPI from '../../app/api/authenticate';

const initialState = {
    pending: false,
    success: false,
    error: false,
    user: false
  }

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signupPending: state => ({ ...state, pending: true, success: false, error: false}),
    signupSuccess: (state, action) =>  ({ ...state, user: action.payload, success: true, pending: false, error: false}),
    signupError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload }),
    reset: () => initialState
  },
});

export const { signupPending, signupSuccess, signupError, reset } = signupSlice.actions;


export const signup = (credentials) => dispatch => {
    dispatch(signupPending());
    authAPI.signup(credentials)
    .then( res => {
        dispatch(signupSuccess(res.data.user));
    })
    .catch( error => {
      let responseError = { FE_CODE: "ERR_SIGNUP" };
      if(error.response){
        const {status, data} = error.response;
        responseError = { ...responseError, status, data}
      }
        dispatch(signupError(responseError));
    })
};

export default signupSlice.reducer;
