import { useRef, useState, useEffect } from 'react';
import Toggle from '../components/Toggle';
import { MdOutlineLockReset } from 'react-icons/md';
import { useAppDispatch } from '../redux/store';
import { useAppSelector } from '../redux/store';
import { verifyPasswordRequest } from '../redux/feats/auth/authActions';
import ChangePassword from '../components/Auth/ChangePassword';
function ResetPassword() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);

  const digit1 = useRef<HTMLInputElement | null>(null);
  const digit2 = useRef<HTMLInputElement | null>(null);
  const digit3 = useRef<HTMLInputElement | null>(null);
  const digit4 = useRef<HTMLInputElement | null>(null);
  const digit5 = useRef<HTMLInputElement | null>(null);

  const [isInvalidCode, setIsInvalidCode] = useState<boolean>(false);
  const [canResetPassword, setCanResetPassword] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
  useEffect(() => {
    if (digit1.current) {
      digit1.current.focus();
    }
  }, []);

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let code: string =
      digit1.current!.value.toString() +
      digit2.current!.value.toString() +
      digit3.current!.value.toString() +
      digit4.current!.value.toString() +
      digit5.current!.value.toString();
    const data = {
      email: email,
      code: code,
    };
    try {
      await dispatch(verifyPasswordRequest(data)).unwrap();
      setCanResetPassword(true);
    } catch (error: any) {
      if (error.status === 400) {
        setIsInvalidCode(true);
        setResponseMessage(error.message);
      }
    }
  };
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const nextInput = input.nextElementSibling as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    if (input.value.length === input.maxLength && nextInput) {
      nextInput.focus();
    }
  };

  return (
    <div className="flex min-h-full w-screen flex-col bg-slate-400 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center">
        {canResetPassword ? (
          <ChangePassword />
        ) : (
          <div
            className={`flex w-5/6 flex-col justify-center rounded-lg border bg-white p-5 dark:bg-slate-700 lg:w-1/3 ${
              isInvalidCode ? 'border-rose-500 dark:border-rose-500' : ''
            }`}
          >
            <div className="flex justify-center  text-2xl dark:text-white lg:text-4xl">
              <div className="flex items-center">Verification</div>
              <div className="flex items-center">
                <MdOutlineLockReset size="50" />
              </div>
            </div>
            <span className="text-bold text-center text-lg dark:text-gray-400">
              Enter the verification code send to your email!
            </span>
            <form onSubmit={formHandler}>
              <div className="mt-5 flex flex-row justify-center px-2 text-center">
                <input
                  className="m-2 h-10 w-10 rounded border text-center"
                  type="text"
                  id="first"
                  maxLength={1}
                  ref={digit1}
                  onInput={handleInput}
                />
                <input
                  className="m-2 h-10 w-10 rounded border text-center"
                  type="text"
                  id="second"
                  maxLength={1}
                  ref={digit2}
                  onInput={handleInput}
                />
                <input
                  className="m-2 h-10 w-10 rounded border text-center"
                  type="text"
                  id="third"
                  maxLength={1}
                  ref={digit3}
                  onInput={handleInput}
                />
                <input
                  className="m-2 h-10 w-10 rounded border text-center"
                  type="text"
                  id="fourth"
                  maxLength={1}
                  ref={digit4}
                  onInput={handleInput}
                />
                <input
                  className="m-2 h-10 w-10 rounded border text-center"
                  type="text"
                  id="fifth"
                  maxLength={1}
                  ref={digit5}
                  onInput={handleInput}
                />
              </div>
              {isInvalidCode && (
                <div className="flex justify-center">
                  <span className="text-xs text-red-500 lg:text-lg">
                    {responseMessage}
                  </span>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
