import Axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterUser } from '../../../types';

export const registerUser = createAsyncThunk(
  '/api/auth',
  async (userData: RegisterUser, { rejectWithValue }) => {
    try {
      const result = await Axios.post(
        'http://localhost:3001/api/auth/register',
        userData
      );
      let newUserID = result.data.user._id;
      await Axios.post('http://localhost:3001/api/schedules/', {
        user_id: newUserID,
      });
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'api/auth',
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await Axios.post(
        'http://localhost:3001/api/auth/login',
        userData
      );
      localStorage.setItem('userToken', data.data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
