import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Schedule as ScheduleType } from '../../../types';
import { TimeSlot as TimeSlotType } from '../../../types';

export const scheduleAPI = createApi({
  reducerPath: 'scheduleAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: (headers, { getState }: any) => {
      const token: string | undefined = getState().auth.userToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    createTimeSlot: builder.mutation<
      ScheduleType,
      { scheduleId: string; timeSlot: TimeSlotType }
    >({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/`,
        method: 'POST',
        body: timeSlot,
      }),
    }),
    deleteTimeSlot: builder.mutation<
      ScheduleType,
      { scheduleId: string; timeSlot: { _id: string } }
    >({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/timeSlot`,
        method: 'DELETE',
        body: timeSlot,
      }),
    }),
  }),
});

export const { useCreateTimeSlotMutation, useDeleteTimeSlotMutation } =
  scheduleAPI;
