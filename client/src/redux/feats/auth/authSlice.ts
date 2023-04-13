import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser } from './authActions';

const userInfoFromStorage = localStorage.getItem('userInfo');
const userTokenFromStorage = localStorage.getItem('userToken');

const initialState = {
  loading: false,
  userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : {},
  userToken: userTokenFromStorage || '',
  error: null,
  success: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout : (state) =>{
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      state.loading = false
      state.userInfo = null
      state.userToken = ''
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
