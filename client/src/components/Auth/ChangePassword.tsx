import { useState, useRef } from 'react';
import { changePassword } from '../../redux/feats/auth/authActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { TextInput, Label, Button } from 'flowbite-react';

function ChangePassword() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);

  const newPassword = useRef(document.createElement('input'));
  const oldPassword = useRef(document.createElement('input'));
  const confirmPassword = useRef(document.createElement('input'));

  const [validPassword, setIsValidPassword] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<boolean | undefined>(
    undefined
  );

  const formHandler = async () => {
    const data = {
      email: email,
      newPassword: newPassword.current.value,
      currentPassword: oldPassword.current.value,
      confirmNewPassword: confirmPassword.current.value,
    };

    try {
      await dispatch(changePassword(data));
    } catch (error: any) {
      setIsValidPassword(false);
    }
  };

  return (
    <div
      className={`flex w-5/6 flex-col justify-center rounded-lg border bg-white p-5 dark:bg-slate-700 lg:w-1/3 ${
        !validPassword ? 'border-rose-500 dark:border-rose-500' : ''
      }`}
    >
      <div className="flex flex-col">
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
          <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
            Reset Password
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="currentPassword" value="Current Password" />
            </div>
            <TextInput
              ref={oldPassword}
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
              ref={newPassword}
              id="NewPassword"
              type="password"
              required={true}
              placeholder="••••••••"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newConfirmedPassword" value="Confirm Password" />
            </div>
            <TextInput
              ref={confirmPassword}
              id="newConfirmedPassword"
              type="password"
              required={true}
              placeholder="••••••••"
            />
          </div>
        </div>
        <Button onClick={formHandler} size="lg">
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ChangePassword;
