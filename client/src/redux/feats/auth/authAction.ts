import Axios from 'axios';
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
interface loginUserData {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  '/api/user',
  async (userData: registerUserData, { rejectWithValue }) => {
    try {
      await Axios.post('http://localhost:3001/api/user/');
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'api/login',
  async (userData: loginUserData, { rejectWithValue }) => {
    try {
      const data = await Axios.post('http://localhost:3001/api/auth/login', {
        userData,
      });
      localStorage.setItem('userToken', data.data.token);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);
