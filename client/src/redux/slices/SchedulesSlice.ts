import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TimeSlot = {
  _id: string;
  day: string;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
  professor: string | null;
  color: string;
};

type Schedule = {
<<<<<<< HEAD
  _id: string;
  userId: string;
  visibility: string;
=======
  _id: string
  userId: string
  visibility: string
>>>>>>> d89fb339c9befacdaba6fa24e8352dde57d91bce
  timeSlots: TimeSlot[];
};

interface SchedulesState {
  value: Schedule[];
}

const initialState: SchedulesState = {
  value: [],
};

export const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    loadSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.value = action.payload;
    },
  },
});

export const { loadSchedules } = schedulesSlice.actions;

export default schedulesSlice.reducer;
