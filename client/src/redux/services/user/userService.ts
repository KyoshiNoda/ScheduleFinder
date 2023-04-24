import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User as UserType } from '../../../types';
export const userAPI = createApi({
  reducerPath: 'userAPI',
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
    updateUserInfo: builder.mutation<UserType, Partial<UserType>>({
      query: (body) => ({
        url: 'api/users',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<
      boolean,
      {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      }
    >({
      query: (body) => ({
        url: 'api/users/changePassword',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
  useChangePasswordMutation,
} = userAPI;
