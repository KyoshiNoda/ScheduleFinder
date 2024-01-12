import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Schedule as ScheduleType } from '../../../types';
import { TimeSlot as TimeSlotType } from '../../../types';
import { getApiUrl } from '../../../utils/environment';

let BASE_URL = getApiUrl();
export const scheduleAPI = createApi({
  reducerPath: 'scheduleAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: (headers, { getState }: any) => {
      headers.set('Accept', 'application/json');
      headers.set('Cache-Control', 'no-cache');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');

      const token: string | undefined = getState().auth.userToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    },
  }),
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: () => ({
        url: 'api/schedules/mySchedule',
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),
    getExternalSchedule: builder.query<ScheduleType, string>({
      query: (scheduleId) => ({
        url: `api/schedules/${scheduleId}/user`,
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),
    clearSchedule: builder.mutation<ScheduleType, { scheduleId: string }>({
      query: ({ scheduleId }) => ({
        url: `api/schedules/${scheduleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),
    createTimeSlot: builder.mutation<ScheduleType, { scheduleId: string; timeSlot: TimeSlotType }>({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/`,
        method: 'POST',
        body: timeSlot,
      }),
      invalidatesTags: ['Schedule'],
    }),
    deleteTimeSlot: builder.mutation<ScheduleType, { scheduleId: string; timeSlot: { _id: string } }>({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/timeSlot`,
        method: 'DELETE',
        body: timeSlot,
      }),
      invalidatesTags: ['Schedule'],
    }),
    updateTimeSlot: builder.mutation<ScheduleType, { scheduleId: string; timeSlot: TimeSlotType }>({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/timeSlot`,
        method: 'PATCH',
        body: timeSlot,
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetExternalScheduleQuery,
  useClearScheduleMutation,
  useCreateTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useUpdateTimeSlotMutation,
} = scheduleAPI;
