import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
type Schedule = {
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
};
type TimeSlot = {
  _id?: string;
  days: Days;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location?: string | null;
  professor?: string | null;
};
type Days = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

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
      Schedule,
      { scheduleId: string; timeSlot: TimeSlot }
    >({
      query: ({ scheduleId, timeSlot }) => ({
        url: `api/schedules/${scheduleId}/`,
        method: 'POST',
        body: timeSlot,
      }),
    }),
  }),
});

export const { useCreateTimeSlotMutation } = scheduleAPI;
