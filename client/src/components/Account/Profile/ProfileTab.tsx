import { useState, useEffect, useRef } from 'react';
import { Spinner } from 'flowbite-react';
import { useChangePasswordMutation } from '../../../redux/services/user/userService';
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from '../../../redux/services/user/userService';
import { User as UserType } from '../../../types';
import { ToastEnum } from '../../../enums';
import ProfilePic from './ProfilePic';
import { useAppDispatch } from '../../../redux/store';
import { updateUserInfo } from '../../../redux/feats/auth/authSlice';
import { useToast } from '../../../utils/functions';
import ChangePasswordModal from '../../Modals/ChangePasswordModal';

const ProfileTab = () => {
  const { showToast } = useToast();
  const { data, isLoading } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [updateUser] = useUpdateUserInfoMutation();
  const [changePassword] = useChangePasswordMutation();

  const [isCurrentPasswordError, setIsCurrentPasswordError] = useState<boolean>(false);
  const [isNewPasswordError, setIsNewPasswordError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const emailRef = useRef(document.createElement('input'));
  const currentPasswordRef = useRef(document.createElement('input'));
  const newPasswordRef = useRef(document.createElement('input'));
  const newConfirmedPasswordRef = useRef(document.createElement('input'));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data && !isLoading) {
      const userInfoWithoutPassword = { ...data };
      delete userInfoWithoutPassword.password;
      setUserInfo(userInfoWithoutPassword);
    }
  }, [data, isLoading]);

  const emailHandler = async () => {
    try {
      const updatedUser = await updateUser({
        ...userInfo,
        email: emailRef.current?.value,
      }).unwrap();
      dispatch(updateUserInfo(updatedUser));
      showToast(ToastEnum.UPDATE_EMAIL);
    } catch (error) {
      console.log(error);
    }
  };

  const passwordHandler = async () => {
    try {
      await changePassword({
        currentPassword: currentPasswordRef.current.value,
        newPassword: newPasswordRef.current.value,
        confirmNewPassword: newConfirmedPasswordRef.current.value,
      }).unwrap();
      showToast(ToastEnum.UPDATE_PASSWORD);
      setIsChangePassword(false);
    } catch (error: any) {
      if (error.data.includes('Incorrect')) {
        setIsCurrentPasswordError(true);
      }
      if (error.data.includes('match')) {
        setIsNewPasswordError(true);
      }
      setErrorMessage(error.data);
    }
  };

  return (
    <div>
      {userInfo ? (
        <>
          <div className="flex items-center gap-3 py-4">
            <ProfilePic picture={userInfo!.photoURL} />
            <div className="font-md text-2xl dark:text-white">
              {userInfo.firstName} {userInfo.lastName}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="default-input"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              ref={emailRef}
              type="text"
              id="default-input"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              defaultValue={userInfo.email}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={emailHandler}
              className="w-full rounded bg-green-400 px-8 py-3 text-lg font-semibold text-white hover:bg-green-600 dark:bg-green-700 hover:dark:bg-green-800"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsChangePassword(true)}
              className="w-full rounded bg-blue-400 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-600 dark:bg-blue-700 hover:dark:bg-blue-800"
            >
              Change Password
            </button>
          </div>
          <ChangePasswordModal
            isChangePassword={isChangePassword}
            setIsChangePassword={setIsChangePassword}
            currentPasswordRef={currentPasswordRef}
            newPasswordRef={newPasswordRef}
            newConfirmedPasswordRef={newConfirmedPasswordRef}
            isCurrentPasswordError={isCurrentPasswordError}
            isNewPasswordError={isNewPasswordError}
            errorMessage={errorMessage}
            passwordHandler={passwordHandler}
          />
        </>
      ) : isLoading ? (
        <div className="flex justify-center">
          <Spinner aria-label="Profile loading spinner" size="xl" />
        </div>
      ) : (
        <div>User information not available.</div>
      )}
    </div>
  );
};

export default ProfileTab;
