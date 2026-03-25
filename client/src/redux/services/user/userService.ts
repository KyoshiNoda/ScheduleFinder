import { createApi } from '@reduxjs/toolkit/query/react';
import { User as UserType } from '../../../types';
import { FileUploadResponse } from '../../../types';
import { createAuthorizedBaseQuery } from '../baseQuery';

export const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: createAuthorizedBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: 'api/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getExternalUserInfo: builder.query<UserType, string>({
      query: (userId) => ({
        url: `api/users/${userId}`,
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
        url: 'api/users/changePassword/token',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getUserFriends: builder.query({
      query: () => ({
        url: 'api/users/friends',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    deleteFriend: builder.mutation<{ message: string; friends: UserType[] }, { friendID: string }>({
      query: ({ friendID }) => ({
        url: `api/users/friends/${friendID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserFriendRequests: builder.query({
      query: () => ({
        url: 'api/users/friendRequest',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    acceptFriendRequest: builder.mutation<{ message: string; updatedFriendRequests: UserType[] }, { friendID: string }>({
      query: ({ friendID }) => ({
        url: `api/users/friends/accept/${friendID}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    rejectFriendRequest: builder.mutation<{ message: string; updatedFriendRequests: UserType[] }, { friendID: string }>({
      query: ({ friendID }) => ({
        url: `api/users/friends/reject/${friendID}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    sendFriendRequest: builder.mutation<{ message: string }, { friendID: string }>({
      query: ({ friendID }) => ({
        url: `api/users/friendRequest/${friendID}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getPendingFriendRequests: builder.query({
      query: () => ({
        url: 'api/users/friendRequest/sent',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    removePendingFriendRequest: builder.mutation<{ message: string; updatedSendFriendRequests: UserType[] }, { friendID: string }>({
      query: ({ friendID }) => ({
        url: `api/users/friendRequest/sent/${friendID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    changeProfilePicture: builder.mutation<FileUploadResponse, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('photoURL', file);

        return {
          url: 'api/users/image',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetExternalUserInfoQuery,
  useGetUserFriendsQuery,
  useUpdateUserInfoMutation,
  useChangePasswordMutation,
  useDeleteFriendMutation,
  useGetUserFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
  useRemovePendingFriendRequestMutation,
  useChangeProfilePictureMutation,
} = userAPI;
