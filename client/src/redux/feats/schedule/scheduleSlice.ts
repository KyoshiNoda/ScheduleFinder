import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Schedule as ScheduleType } from '../../../types';

interface SchedulesState {
  value: ScheduleType[];
}

const initialState: SchedulesState = {
  value: [],
};

export const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    loadSchedules: (state, action: PayloadAction<ScheduleType[]>) => {
      state.value = action.payload;
    }
  },
});

export const { loadSchedules } = schedulesSlice.actions;

export default schedulesSlice.reducer;