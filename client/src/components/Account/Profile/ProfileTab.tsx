import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from '../../../redux/services/user/userService';
import { User as UserType } from '../../../types';
import ProfilePic from './ProfilePic';
function ProfileTab() {
  const { data, isLoading } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserInfoMutation();
  const emailRef = useRef(document.createElement('input'));
  const passwordRef = useRef(document.createElement('input'));

  useEffect(() => {
    if (data && !isLoading) {
      const userInfoWithoutPassword = { ...data[0] };
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
              className="w-full rounded bg-green-400 px-8 py-3 text-lg font-semibold text-white dark:bg-green-800"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setChangePassword(true)}
              className="w-full rounded bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-blue-800"
            >
              Change Password
            </button>{' '}
            <Modal
              show={changePassword}
              size="md"
              popup={true}
              onClose={() => setChangePassword(false)}
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
                        id="NewPassword"
                        type="password"
                        required={true}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label
                          htmlFor="confirmPassword"
                          value="Confirm Password"
                        />
                      </div>
                      <TextInput
                        id="confirmPassword"
                        type="password"
                        required={true}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <Button onClick={() => setChangePassword(true)} size="xl">
                    Submit
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            <button
              type="button"
              className="w-full rounded bg-red-400 px-8 py-3 text-lg font-semibold text-white dark:bg-red-800"
            >
              Delete My Account
            </button>
          </div>
        </>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>User information not available.</div>
      )}
    </div>
  );
}

export default ProfileTab;
{
  /* <button
type="button"
onClick={() => setChangePassword(true)}
className="w-full rounded bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-blue-800"
>
Change Password
</button> */
}
