import { useState } from 'react';
import { FaUserLock } from 'react-icons/fa';
import Toggle from '../components/Toggle';
import { useAppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import {
  emailCheck,
  resetPasswordRequest,
} from '../redux/feats/auth/authActions';
const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const navigate = useNavigate();

  const checkEmailHandler = async () => {
    try {
      await dispatch(emailCheck({ email: email })).unwrap();
      await dispatch(resetPasswordRequest({ email: email })).unwrap();
      navigate('/resetPassword');
    } catch (error: any) {
      if (error.status === 404) {
        setIsInvalidEmail(true);
        setResponseMessage(error.message);
      }
    }
  };

  return (
    <div className="flex min-h-full w-screen flex-col bg-gray-50 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex w-5/6 flex-col justify-center rounded-lg bg-gray-200 p-5 dark:bg-slate-700 lg:w-1/3">
          <div className="flex justify-center">
            <FaUserLock size="80" />
          </div>
          <div className="flex justify-center text-2xl dark:text-white lg:text-4xl">
            Forgot Password?
          </div>
          <div className="flex justify-center space-y-10">
            <p className="md:text-md mb-2 block text-gray-900 dark:text-gray-300">
              Check your email for a 5 digit code!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <div className="flex flex-col">
                <div>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="johndoe@gmail.com"
                    className={`w-full rounded-md border-gray-500 bg-gray-50 px-4 py-3 text-sm dark:border-gray-100 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-blue-400 ${
                      isInvalidEmail
                        ? 'border-rose-500 dark:border-rose-500'
                        : ''
                    }`}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {isInvalidEmail && (
                  <span className="text-xs text-red-500">
                    {responseMessage}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="w-1/2 rounded-xl bg-blue-400 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-600 dark:bg-slate-300 dark:text-black hover:dark:bg-slate-400"
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
};

export default ForgotPassword;
