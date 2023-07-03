import Toggle from '../components/Toggle';
import { MdOutlineLockReset } from 'react-icons/md';
function ResetPassword() {
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
          <div className="flex flex-col"></div>
          <div className="mt-5 flex flex-row justify-center px-2 text-center">
            <input
              className="m-2 h-10 w-10 rounded border text-center"
              type="text"
              id="first"
              maxLength={1}
            />
            <input
              className="m-2 h-10 w-10 rounded border text-center"
              type="text"
              id="second"
              maxLength={1}
            />
            <input
              className="m-2 h-10 w-10 rounded border text-center"
              type="text"
              id="third"
              maxLength={1}
            />
            <input
              className="m-2 h-10 w-10 rounded border text-center"
              type="text"
              id="fourth"
              maxLength={1}
            />
            <input
              className="m-2 h-10 w-10 rounded border text-center"
              type="text"
              id="fifth"
              maxLength={1}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="w-1/2 rounded-xl bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
