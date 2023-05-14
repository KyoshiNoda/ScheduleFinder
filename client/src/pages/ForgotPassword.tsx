import Toggle from '../components/Toggle';

function ForgotPassword() {
  return (
    <div className="flex min-h-full w-screen flex-col  gap-10 bg-slate-400 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center">
        <div className="flex w-full flex-col justify-center rounded bg-white">
          <div>Reset Password</div>
          Please enter your email below
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
