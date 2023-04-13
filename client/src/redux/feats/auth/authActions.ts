import Axios, { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface registerUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  photoURL: string;
  gender: string;
  school: string;
  major: string;
}

export const registerUser = createAsyncThunk(
  '/api/auth',
  async (userData: registerUserData, { rejectWithValue }) => {
    try {
      await Axios.post('http://localhost:3001/api/auth/', userData);
    } catch (error) {
      console.log(error);
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
