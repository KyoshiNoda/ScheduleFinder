import { FormEventHandler, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/feats/auth/authActions';
import { useAppDispatch } from '../../redux/store';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const defaultError: string = 'Something went wrong!';

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] =
    useState<string>(defaultError);
  const [passwordErrorMessage, setPasswordErrorMessage] =
    useState<string>(defaultError);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      // attempts to login user if sucesss navigate to schedule
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/auth/schedule');
    } catch (error: any) {
      // if login is not successful render input error styles and display backend error message
      if (error.response && error.response.status === 400) {
        // gets the error from backend
        let errorMessage: string = error.response.data.error;

        // checks if response includes a user or password to dynmically render
        if (errorMessage.includes('Email')) {
          setEmailError(true);
          setEmailErrorMessage(errorMessage);
        } else {
          setEmailError(false);
        }
        if (errorMessage.includes('password')) {
          setPasswordError(true);
          setPasswordErrorMessage(errorMessage);
        }
      }
    }
  };

  return (
    <>
      <form
        className="ng-untouched ng-pristine ng-valid space-y-6"
        onSubmit={formHandler}
      >
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-sm font-bold md:text-lg">
            Email
          </label>
          <div></div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            className={`w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-blue-400 ${
              emailError ? 'border-rose-500' : ''
            }`}
          />
          {emailError && (
            <span className="text-xs text-red-500">{emailErrorMessage}</span>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <label
            htmlFor="password"
            className="text:sm block font-bold md:text-lg"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            onChange={(event) => setPassword(event.target.value)}
            className={`w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-blue-400 ${
              passwordError ? 'border-rose-500' : ''
            }`}
          />
          {passwordError && (
            <span className="text-xs text-red-500">{passwordErrorMessage}</span>
          )}
          <div className="flex justify-end text-xs dark:text-gray-400">
            <Link rel="noopener noreferrer" to="/forgotPassword">
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="block w-full bg-blue-400 p-3 text-center font-bold text-white first-letter:rounded-sm hover:bg-blue-600 dark:bg-slate-300 dark:text-gray-900 dark:hover:bg-slate-400"
        >
          Sign in
        </button>
      </form>
    </>
  );
};

export default LoginForm;
