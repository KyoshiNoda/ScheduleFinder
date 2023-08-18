import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  readOnly: false,
  toast: {},
};

const globalSlice = createSlice({
  name: 'globalSlice',
  initialState,
  reducers: {
    toggleReadOnly: (state, action) => {
      state.readOnly = action.payload;
    },
    toast: (state, action) => {
      state.toast = action.payload;
    },
  },
});

export default globalSlice.reducer;
export const { toggleReadOnly, toast } = globalSlice.actions;
