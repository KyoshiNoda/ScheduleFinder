import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feats/auth/authSlice';
import globalSliceReducer from './feats/globalSlice/globalSlice';
import { authAPI } from './services/auth/authService';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { scheduleAPI } from './services/schedule/scheduleService';
import { userAPI } from './services/user/userService';

const store = configureStore({
  reducer: {
    auth: authReducer,
    globalSlice: globalSliceReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [scheduleAPI.reducerPath]: scheduleAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(scheduleAPI.middleware)
      .concat(userAPI.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
