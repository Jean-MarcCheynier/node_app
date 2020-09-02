import { createSlice } from '@reduxjs/toolkit';
import { setToken } from '../../app/api/axios';
import * as authAPI from '../../app/api/authenticate';

const initialState = {
    pending: false, 
    success: false, 
    error: false,
    user: false
  }

export const signinSlice = createSlice({
  name: 'signin',
  initialState,
  reducers: {
    signinPending: () =>  ({ ...initialState, pending: true, success: false, error: false}),
    signinSuccess: (state, action) =>  ({ ...state, user: action.payload, pending: false, success: true, error: false}),
    signinError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload}),
    clearForm: (state) => ({...initialState, user: state.user}),
    reset: () => ({...initialState})
  },
});

export const { signinPending, signinSuccess, signinError, clearForm, reset } = signinSlice.actions;

export const signin = (credentials) => dispatch => {
    dispatch(signinPending());
    authAPI.signin(credentials)
    .then( res => {
      dispatch(onUserSignedIn(res.data))
    })
    .catch( error => {
      let responseError = { FE_CODE: "ERR_SIGNIN" };
      if(error.response){
        const {status, data} = error.response;
        responseError = { ...responseError, status, data}
      }
      dispatch(signinError(responseError));
    })
};

export const onUserSignedIn = (user) => dispatch => {
  sessionStorage.setItem("user", JSON.stringify(user));
  setToken(user.jwt);
  dispatch(signinSuccess(user));
}

export const signout = () => dispatch => {
  console.log("coucou")
  sessionStorage.removeItem("user");
  dispatch(reset());
}

export default signinSlice.reducer;
