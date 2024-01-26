import { getApiUrl } from '../../../utils/environment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User as UserType } from '../../../types';
let BASE_URL = getApiUrl();
export const hobbyAPI = createApi({
  reducerPath: 'hobbyAPI',
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
  tagTypes: ['Hobby'],
  endpoints: (builder) => ({
    getHobbies: builder.query({
      query: () => ({
        url: 'api/hobby',
        method: 'GET',
      }),
      providesTags: ['Hobby'],
    }),
    addHobby: builder.mutation<UserType, { name: string }>({
      query: ({ name }) => ({
        url: 'api/hobbies',
        method: 'POST',
        body: name,
      }),
      invalidatesTags: ['Hobby'],
    }),
    editHobby: builder.mutation<UserType, { hobbyID: string }>({
      query: ({ hobbyID }) => ({
        url: `api/hobby/${hobbyID}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Hobby'],
    }),
    deleteHobby: builder.mutation<UserType, { hobbyID: string }>({
      query: ({ hobbyID }) => ({
        url: `api/hobby/${hobbyID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hobby'],
    }),
  }),
});

export const { useGetHobbiesQuery, useAddHobbyMutation, useDeleteHobbyMutation, useEditHobbyMutation } = hobbyAPI;
