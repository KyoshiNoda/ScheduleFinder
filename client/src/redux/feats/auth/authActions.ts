import Axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterUser } from '../../../types';
import { getApiUrl } from '../../../utils/environment';

let BASE_URL = getApiUrl();

export const registerUser = createAsyncThunk(
  '/api/auth',
  async (userData: RegisterUser, { rejectWithValue }) => {
    try {
      const result = await Axios.post(`${BASE_URL}api/auth/register`, userData);
      if (result.status === 200) {
        await Axios.post(
          `${BASE_URL}api/schedules/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${result.data.token}`,
            },
          }
        );
      }
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
      const data = await Axios.post(`${BASE_URL}api/auth/login`, userData);
      localStorage.setItem('userToken', data.data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
