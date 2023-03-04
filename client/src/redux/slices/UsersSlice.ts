import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  photoURL: string;
  email: string;
  password: string;
  gender: string;
  school: string;
};

interface UsersState {
  value: User[];
}

const initialState: UsersState = {
  value: [],
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loadUsers: (state, action: PayloadAction<User[]>) => {
      state.value = action.payload;
    },
  },
});

export const { loadUsers } = usersSlice.actions;

<<<<<<< HEAD
export default usersSlice.reducer;
=======
export default usersSlice.reducer;
>>>>>>> d89fb339c9befacdaba6fa24e8352dde57d91bce
