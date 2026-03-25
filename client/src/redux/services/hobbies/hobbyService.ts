import { createApi } from '@reduxjs/toolkit/query/react';
import { User as UserType } from '../../../types';
import { createAuthorizedBaseQuery } from '../baseQuery';

export const hobbyAPI = createApi({
  reducerPath: 'hobbyAPI',
  baseQuery: createAuthorizedBaseQuery(),
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
