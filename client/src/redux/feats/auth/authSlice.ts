import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, resetPasswordRequest } from './authActions';

const userInfoFromStorage = localStorage.getItem('userInfo');
const userTokenFromStorage = localStorage.getItem('userToken');

const initialState = {
  loading: false,
  userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : {},
  userToken: userTokenFromStorage || '',
  error: null,
  success: false,
  email: localStorage.getItem('tempEmail') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      state.loading = false;
      state.userInfo = null;
      state.userToken = '';
      state.error = null;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        state.userInfo = payload.data.user;
        state.userToken = payload.data.token;
        state.success = true;
        localStorage.setItem('userInfo', JSON.stringify(payload.data.user));
        localStorage.setItem('userToken', payload.data.token);
      })
      .addCase(registerUser.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        state.userInfo = payload.data.user;
        state.userToken = payload.data.token;
        state.success = true;
        localStorage.setItem('userInfo', JSON.stringify(payload.data.user));
        localStorage.setItem('userToken', payload.data.token);
      })
      .addCase(loginUser.rejected, (state, { payload }: any) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(resetPasswordRequest.fulfilled, (state, { payload }) => {
        state.email = payload.data.email;
        localStorage.setItem('tempEmail', state.email!);
      })
      .addCase(resetPasswordRequest.rejected, (state, { payload }) => {
        state.email = null;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
