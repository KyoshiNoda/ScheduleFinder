import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  readOnly: false,
  addFriendRequestToast: false,
};

const globalSlice = createSlice({
  name: 'globalSlice',
  initialState,
  reducers: {
    toggleReadOnly: (state, action) => {
      state.readOnly = action.payload;
    },
    addFriendRequestToast: (state, action) => {
      state.addFriendRequestToast = action.payload;
    },
  },
});

export default globalSlice.reducer;
export const { toggleReadOnly, addFriendRequestToast } = globalSlice.actions;
