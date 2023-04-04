import SignUpForm from './SignUpForm';
import GoogleAuth from '../Auth/GoogleAuth';
type Props = {};

function SignUpBox({}: Props) {
  return (
    <div className="flex h-full w-5/6 flex-col rounded-lg bg-gray-100 p-10 dark:bg-slate-800  dark:text-gray-100 md:w-2/3 lg:w-1/3">
      <div className="mb-5 flex justify-center text-4xl dark:text-white md:text-5xl">
        Sign up
      </div>
      <SignUpForm />
      <div className="flex items-center space-x-1 pt-4">
        <div className="h-px flex-1 bg-gray-900 dark:bg-gray-700 sm:w-16"></div>
        <p className="px-3 text-sm dark:text-gray-400">Login with Google</p>
        <div className="h-px flex-1 bg-gray-900 dark:bg-gray-700 sm:w-16"></div>
      </div>
      <GoogleAuth />
      <p className="text-center text-xs dark:text-gray-400 sm:px-6">
        Have an account? {}
        <a
          rel="noopener noreferrer"
          href="/login"
          className="underline dark:text-gray-100"
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default SignUpBox;
