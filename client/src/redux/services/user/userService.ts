import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const userAPI = createApi({
  reducerPath: 'scheduleAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: 'api/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
  
});

export const {
  useGetUserInfoQuery
} = userAPI;