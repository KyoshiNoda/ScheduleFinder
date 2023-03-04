import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import schedulesReducer from '../slices/SchedulesSlice';

const rootReducer = combineReducers({
  schedules: schedulesReducer,
});

const store = configureStore({
  reducer: {
    schedules: schedulesReducer,
  },
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
