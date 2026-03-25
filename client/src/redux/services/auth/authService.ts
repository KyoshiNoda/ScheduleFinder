import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthorizedBaseQuery } from '../baseQuery';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: createAuthorizedBaseQuery(),
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
