import { FormEventHandler, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/feats/auth/authActions';
import { useAppDispatch } from '../../redux/store';

type Props = {};
function LoginForm(props: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  useEffect(() => {
    console.log(emailError, passwordError);
  }, [emailError, passwordError]);

  const formHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/auth/schedule');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
        console.log(error.response.data.error);
        error.response.data.error.includes('User') && setEmailError(true);
        error.response.data.error.includes('password') &&
          setPasswordError(true);
      } else {
        setErrorMessage('something went wrong');
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
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            className={`w-full rounded-md border-gray-100 bg-gray-50 px-4 py-3 text-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400 ${
              emailError ? 'border-rose-500' : ''
            }`}
          />
          {emailError && (
            <span className="text-xs text-red-500">Email is incorrect</span>
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
            className={`w-full rounded-md border-gray-100 bg-gray-50 px-4 py-3 text-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400 ${
              passwordError ? 'border-rose-500' : ''
            }`}
          />
          {passwordError && (
            <span className="text-xs text-red-500">Password is incorrect</span>
          )}
          <div className="flex justify-end text-xs dark:text-gray-400">
            <a rel="noopener noreferrer" href="#">
              Forgot Password?
            </a>
          </div>
        </div>
        <button
          type="submit"
          className="block w-full rounded-sm bg-blue-400 p-3 text-center font-bold text-white dark:bg-slate-300 dark:text-gray-900"
        >
          Sign in
        </button>
      </form>
    </>
  );
}

export default LoginForm;
