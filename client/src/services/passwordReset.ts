import Axios from 'axios';
import { getApiUrl } from '../utils/environment';

const baseUrl = getApiUrl();

export interface PasswordResetApiError {
  status: number;
  code?: string;
  message: string;
}

export interface VerifiedPasswordReset {
  resetToken: string;
  expiresInSeconds: number;
}

const getApiErrorMessage = (data: any): string => {
  if (data?.code === 'VALIDATION_ERROR' && Array.isArray(data.issues)) {
    return data.issues[0]?.message ?? 'Invalid request.';
  }

  return data?.message ?? data?.error ?? 'Request failed.';
};

const toPasswordResetError = (error: any): PasswordResetApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      code: error.response.data?.code,
      message: getApiErrorMessage(error.response.data),
    };
  }

  return { status: 500, message: 'Internal Server Error' };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await Axios.post(`${baseUrl}api/auth/password-reset/request`, { email });
  } catch (error) {
    throw toPasswordResetError(error);
  }
};

export const verifyPasswordReset = async (
  email: string,
  code: string
): Promise<VerifiedPasswordReset> => {
  try {
    const response = await Axios.post(`${baseUrl}api/auth/password-reset/verify`, {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw toPasswordResetError(error);
  }
};

export const completePasswordReset = async (input: {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<void> => {
  try {
    await Axios.post(`${baseUrl}api/auth/password-reset/complete`, input);
  } catch (error) {
    throw toPasswordResetError(error);
  }
};

