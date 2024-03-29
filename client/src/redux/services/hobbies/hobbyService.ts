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
  tagTypes: ['Hobbies'],
  endpoints: (builder) => ({
    getAllHobbies: builder.query({
      query: () => ({
        url: 'api/hobbies',
        method: 'GET',
      }),
      providesTags: ['Hobbies'],
    }),
    getUserHobbies: builder.query({
      query: () => ({
        url: 'api/hobbies/userHobbies',
        method: 'GET',
      }),
      providesTags: ['Hobbies'],
    }),
    addUserHobby: builder.mutation<UserType, { name: string }>({
      query: ({ name }) => ({
        url: 'api/hobbies/userHobbies',
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Hobbies'],
    }),
    removeUserHobby: builder.mutation<UserType, { name: string }>({
      query: ({ name }) => ({
        url: `api/hobbies/userHobbies/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hobbies'],
    }),
  }),
});

export const {
  useGetAllHobbiesQuery,
  useGetUserHobbiesQuery,
  useAddUserHobbyMutation,
  useRemoveUserHobbyMutation,
} = hobbyAPI;
