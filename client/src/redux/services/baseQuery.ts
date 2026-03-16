import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiUrl } from '../../utils/environment';

export const createAuthorizedBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: getApiUrl(),
    prepareHeaders: (headers, { getState }: any) => {
      headers.set('accept', 'application/json');

      const token: string | undefined = getState().auth.userToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });
