import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  readOnly: false,
};

const timeSlotSlice = createSlice({
  name: 'timeSlot',
  initialState,
  reducers: {
    toggleReadOnly: (state, action) => {
      state.readOnly = action.payload;
    },
  },
});

export default timeSlotSlice.reducer;
export const { toggleReadOnly } = timeSlotSlice.actions;
