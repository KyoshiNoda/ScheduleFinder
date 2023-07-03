import { useRef, useState } from 'react';
import Toggle from '../components/Toggle';
import { MdOutlineLockReset } from 'react-icons/md';
import { useAppDispatch } from '../redux/store';
import { useAppSelector } from '../redux/store';
import { verifyPasswordRequest } from '../redux/feats/auth/authActions';
function ResetPassword() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);

  const digit1 = useRef(document.createElement('input'));
  const digit2 = useRef(document.createElement('input'));
  const digit3 = useRef(document.createElement('input'));
  const digit4 = useRef(document.createElement('input'));
  const digit5 = useRef(document.createElement('input'));

  const [isInvalidCode, setIsInvalidCode] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let code: string =
      digit1.current.value.toString() +
      digit2.current.value.toString() +
      digit3.current.value.toString() +
      digit4.current.value.toString() +
      digit5.current.value.toString();
    const data = {
      email: email,
      code: code,
    };
    try {
      await dispatch(verifyPasswordRequest(data));
      setIsInvalidCode(false);
    } catch (error: any) {
      if (error.status === 400) {
        setIsInvalidCode(true);
        setResponseMessage(error.message);
      }
    }
  };

  return (
    <div className="flex min-h-full w-screen flex-col bg-slate-400 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex w-5/6 flex-col justify-center rounded-lg bg-white p-5 dark:bg-slate-700 lg:w-1/3">
          <div className="flex justify-center text-2xl dark:text-white lg:text-4xl">
            <div className="flex items-center">Verification</div>
            <div className="iems-center flex">
              <MdOutlineLockReset size="50" />
            </div>
          </div>
          <span className="text-bold text-center text-lg">
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
              />
              <input
                className="m-2 h-10 w-10 rounded border text-center"
                type="text"
                id="second"
                maxLength={1}
                ref={digit2}
              />
              <input
                className="m-2 h-10 w-10 rounded border text-center"
                type="text"
                id="third"
                maxLength={1}
                ref={digit3}
              />
              <input
                className="m-2 h-10 w-10 rounded border text-center"
                type="text"
                id="fourth"
                maxLength={1}
                ref={digit4}
              />
              <input
                className="m-2 h-10 w-10 rounded border text-center"
                type="text"
                id="fifth"
                maxLength={1}
                ref={digit5}
              />
            </div>
            {isInvalidCode && (
              <span className="text-xs text-red-500 lg:text-lg">
                {responseMessage}
              </span>
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
      </div>
    </div>
  );
}

export default ResetPassword;
