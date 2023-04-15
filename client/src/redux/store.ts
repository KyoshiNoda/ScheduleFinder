import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feats/auth/authSlice';
import { authAPI } from './services/auth/authService';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { scheduleAPI } from './services/schedule/scheduleService';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [scheduleAPI.reducerPath]: scheduleAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(scheduleAPI.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
