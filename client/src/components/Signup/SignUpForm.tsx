import { useRef } from 'react';
type Props = {};

function SignUpForm({}: Props) {
  const firstName = useRef(document.createElement('input'));
  const lastName = useRef(document.createElement('input'));
  const email = useRef(document.createElement('input'));
  const password = useRef(document.createElement('input'));
  const confirmPassword = useRef(document.createElement('input'));
  const school = useRef(document.createElement('input'));
  const birthday = useRef(document.createElement('input'));
  return (
    <form>
      <div className="flex flex-col">
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              First name
            </label>
            <input
              ref={firstName}
              type="text"
              id="first_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name
            </label>
            <input
              ref = {lastName}
              type="text"
              id="last_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Doe"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              ref = {email}
              type="text"
              id="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="123-45-678"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              ref = {password}
              type="password"
              id="password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              ref = {confirmPassword}
              type="password"
              id="confirm_password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div>
            <label
              htmlFor="School"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              School
            </label>
            <input
              type="text"
              id="school"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="UCLA"
              required
            />
          </div>
          <div>
            <label
              htmlFor="birthdate"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="birthdate"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="UCLA"
              required
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
      >
        Submit
      </button>
    </form>
  );
}

export default SignUpForm;
