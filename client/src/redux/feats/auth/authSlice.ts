import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser } from './authActions';

const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null;

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken,
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [`${registerUser.pending}`]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [`${registerUser.fulfilled}`]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
    },
    [`${registerUser.rejected}`]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    
    
    [`${loginUser.pending}`]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [`${loginUser.fulfilled}`]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      state.userToken = payload.userToken;
    },
    [`${loginUser.rejected}`]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export default authSlice.reducer;
