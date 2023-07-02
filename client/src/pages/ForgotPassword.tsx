import { useState } from 'react';
import { FaUserLock } from 'react-icons/fa';
import Toggle from '../components/Toggle';
import { useAppDispatch } from '../redux/store';
import { emailCheck } from '../redux/feats/auth/authActions';
function ForgotPassword() {
  const dispatch = useAppDispatch();
  const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('test');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkEmailHandler = async () => {
    try {
      await dispatch(emailCheck(email)).unwrap();
      alert('valid email');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        let errorMessage: string = error.response.data.error;
        setIsInvalidEmail(true);
        setErrorMessage(errorMessage);
      }
    }
  };
  return (
    <div className="flex min-h-full w-screen flex-col bg-slate-400 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex w-1/3 flex-col justify-center rounded-lg bg-white p-5 dark:bg-pink-900">
          <div className="flex justify-center">
            <FaUserLock size="80" />
          </div>
          <div className="flex justify-center text-4xl">Forgot Password?</div>
          <div className="flex justify-center space-y-10">
            <p className="text-md mb-2 block text-gray-900 dark:text-white">
              Don't stress! Check your email for a 5 digit code!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="johndoe@gmail.com"
                className={`w-1/2 rounded-md border-gray-500 bg-gray-50 px-4 py-3 text-sm dark:border-gray-100 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-blue-400 ${
                  isInvalidEmail ? 'border-rose-500' : ''
                }`}
                onChange={(event) => setEmail(event.target.value)}
              />
              {isInvalidEmail && (
                <span className="text-xs text-red-500">{errorMessage}</span>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="w-1/2 rounded-xl bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
                onClick={checkEmailHandler}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
