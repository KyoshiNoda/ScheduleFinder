import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useChangePasswordMutation } from '../../../redux/services/user/userService';
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from '../../../redux/services/user/userService';
import { User as UserType } from '../../../types';
import ProfilePic from './ProfilePic';
const ProfileTab: any = () => {
  const { data, isLoading } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserInfoMutation();
  const [changePassword, { isSuccess, isError, error }] =
    useChangePasswordMutation();

  const [currentPasswordError, setCurrentPasswordError] =
    useState<boolean>(false);
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [confirmedNewPasswordError, setConfirmedNewPasswordError] =
    useState<boolean>(false);

  const emailRef = useRef(document.createElement('input'));

  const currentPasswordRef = useRef(document.createElement('input'));
  const newPasswordRef = useRef(document.createElement('input'));
  const newConfirmedPasswordRef = useRef(document.createElement('input'));

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
      setUserInfo(updatedUser);
      window.location.reload();
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
      });
    } catch (error: any) {
      console.log(error);
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
              placeholder={userInfo.email}
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
              className="w-full rounded bg-blue-400 hover:bg-blue-600 px-8 py-3 text-lg font-semibold text-white dark:bg-blue-700 hover:dark:bg-blue-800"
            >
              Change Password
            </button>{' '}
            <Modal
              show={isChangePassword}
              size="md"
              popup={true}
              onClose={() => setIsChangePassword(false)}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="flex flex-col">
                  <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                    <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
                      Reset Password
                    </h3>
                    <div>
                      <div className="mb-2 block">
                        <Label
                          htmlFor="currentPassword"
                          value="Current Password"
                        />
                      </div>
                      <TextInput
                        ref={currentPasswordRef}
                        id="currentPassword"
                        placeholder="••••••••"
                        required={true}
                        type="password"
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="password" value="New Password" />
                      </div>
                      <TextInput
                        ref={newPasswordRef}
                        id="NewPassword"
                        type="password"
                        required={true}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label
                          htmlFor="newConfirmedPassword"
                          value="Confirm Password"
                        />
                      </div>
                      <TextInput
                        ref={newConfirmedPasswordRef}
                        id="newConfirmedPassword"
                        type="password"
                        required={true}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <Button onClick={passwordHandler} size="xl">
                    Submit
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* <button
              type="button"
              className="w-full rounded bg-red-400 px-8 py-3 text-lg font-semibold text-white dark:bg-red-800"
            >
              Delete My Account
            </button> */}
          </div>
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
