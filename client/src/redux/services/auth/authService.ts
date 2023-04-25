import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://schedulefinder-production.up.railway.app/',
    prepareHeaders: (headers, { getState }: any) => {
      const token: string | undefined = getState().auth.userToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: () => ({
        url: 'api/schedules/mySchedule',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetScheduleQuery } = authAPI;
