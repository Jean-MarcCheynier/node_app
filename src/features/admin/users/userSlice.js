import { createSlice } from '@reduxjs/toolkit';
import * as userAPI from '../../../app/api/user';
import { keyBy } from 'lodash';

const initialState = {
    pending: false, 
    success: false, 
    error: false,
    users: {}
  }

export const signinSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersPending: () =>  ({ ...initialState, pending: true, success: false, error: false}),
    fetchUsersSuccess: (state, action) =>  ({ ...state, users: action.payload, pending: false, success: true, error: false}),
    fetchUsersError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload}),
    updateUserPending: (state) =>  ({ ...state, pending: true, success: false, error: false}),
    updateUserSuccess: (state, action) =>  ({ ...state, users: {...state.users, [action.payload._id]: action.payload}, pending: false, success: true, error: false}),
    updateUserError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload}),
    deleteUserPending: (state) =>  ({ ...state, pending: true, success: false, error: false}),
    deleteUserSuccess: (state, action) =>  {
      delete state.users[action.payload];
      state.pending = false;
      state.success = true;
      state.error = false;
    },
    deleteUserError: (state, action) => ({ ...state, pending: false, success: false, error: action.payload}),
    reset: () => ({...initialState})
  },
});

export const { 
  fetchUsersPending, 
  fetchUsersSuccess, 
  fetchUsersError,
  updateUserPending,
  updateUserSuccess,
  updateUserError,
  deleteUserPending,
  deleteUserSuccess,
  deleteUserError,
  reset } = signinSlice.actions;


export const fetchUsers = () => dispatch => {
    dispatch(fetchUsersPending());
    userAPI.fetchUsers()
    .then( res => {
        dispatch(fetchUsersSuccess(keyBy(res.data, '_id')));
    })
    .catch( error => {
      let responseError = { FE_CODE: "ERR_FETCH_USER" };
      if(error.response){
        const {status, data} = error.response;
        responseError = { ...responseError, status, data}
      }
      dispatch(fetchUsersError(responseError));
    })
};

export const updateUser = (user) => dispatch => {
  dispatch(updateUserPending());
  return userAPI.updateUser(user._id, user)
  .then( res => {
      dispatch(updateUserSuccess(res.data));
  })
  .catch( error => {
    let responseError = { FE_CODE: "ERR_UPDATE_USER" };
    if(error.response){
      const {status, data} = error.response;
      responseError = { ...responseError, status, data}
    }
    dispatch(updateUserError(responseError));
  })
};

export const deleteUser = (user) => dispatch => {
  dispatch(deleteUserPending());
  return userAPI.deleteUser(user._id)
  .then( res => {
      dispatch(deleteUserSuccess(res.data._id));
  })
  .catch( error => {
    let responseError = { FE_CODE: "ERR_DELETE_USER" };
    if(error.response){
      const {status, data} = error.response;
      responseError = { ...responseError, status, data}
    }
    dispatch(deleteUserError(responseError));
  })
};

export default signinSlice.reducer;