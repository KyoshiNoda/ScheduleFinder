import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, resetPasswordRequest } from './authActions';

const userInfoFromStorage = localStorage.getItem('userInfo');
const userTokenFromStorage = localStorage.getItem('userToken');
const isTokenExpired = (token: any) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp! * 1000;
};

const initialState = {
  loading: false,
  userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : {},
  userToken: userTokenFromStorage && !isTokenExpired(userTokenFromStorage) ? userTokenFromStorage : '',
  error: null,
  success: false,
  email: localStorage.getItem('tempEmail') || null,
  errorStatus: 0,
  errorMessage: '',
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
      state.email = null;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    }
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
        state.email = null;
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
      .addCase(resetPasswordRequest.rejected, (state) => {
        state.email = null;
      });
  },
});

export default authSlice.reducer;
export const { logout, updateUserInfo } = authSlice.actions;
