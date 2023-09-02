import { useState, useRef } from 'react';
import { changePassword } from '../../redux/feats/auth/authActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Label, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state: any) => state.auth.email);
  const navigate = useNavigate();

  const newPassword = useRef(document.createElement('input'));
  const confirmPassword = useRef(document.createElement('input'));

  const [isInvalidPassword, setisInvalidPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean | undefined>(
    undefined
  );

  const formHandler = async () => {
    const data = {
      email: email,
      newPassword: newPassword.current.value,
      confirmNewPassword: confirmPassword.current.value,
    };

    try {
      await dispatch(changePassword(data)).unwrap();
      navigate('/login');
    } catch (error: any) {
      if (error.status === 401) {
        setisInvalidPassword(true);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="flex w-5/6 flex-col justify-center rounded-lg border bg-white p-5 dark:bg-slate-700 lg:w-1/3">
      <div className="flex flex-col">
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
          <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
            Reset Password
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="New Password" />
            </div>
            <input
              className={`w-full rounded border ${
                isInvalidPassword ? 'border-red-700 dark:border-red-700' : ''
              }`}
              ref={newPassword}
              id="NewPassword"
              type="password"
              required={true}
              placeholder="••••••••"
            />
            {isInvalidPassword && (
              <span className="text-xs text-red-500">{errorMessage}</span>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newConfirmedPassword" value="Confirm Password" />
            </div>
            <input
              className={`w-full rounded border ${
                isInvalidPassword ? 'border-red-700 dark:border-red-700' : ''
              }`}
              ref={confirmPassword}
              id="newConfirmedPassword"
              type="password"
              required={true}
              placeholder="••••••••"
            />
            {isInvalidPassword && (
              <span className="text-xs text-red-500">{errorMessage}</span>
            )}
          </div>
        </div>
        <Button onClick={formHandler} size="lg">
          Reset!
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;
