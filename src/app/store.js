import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// We'll use redux-logger just as an example of adding another middleware
import logger from 'redux-logger'

// And use redux-batch as an example of adding enhancers
import { reduxBatch } from '@manaflair/redux-batch'

import signinReducer from '../features/signin/signinSlice';
import signupReducer from '../features/signup/signupSlice';
import usersReducer from '../features/admin/users/userSlice';
import imageReducer from '../features/uploadPicture/imageSlice';

const reducer = {
  signin: signinReducer,
  signup: signupReducer,
  users: usersReducer,
  image: imageReducer,
}

const middleware = [...getDefaultMiddleware(), logger]

export default configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [reduxBatch]
});
