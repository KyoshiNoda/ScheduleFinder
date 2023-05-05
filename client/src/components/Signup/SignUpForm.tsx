import { useRef, useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { RegisterUser as RegisterUserType } from '../../types';
import { registerUser } from '../../redux/feats/auth/authActions';
import { useNavigate } from 'react-router-dom';
type Props = {};

function SignUpForm({}: Props) {
  const form = useRef(document.createElement('form'));
  const firstName = useRef(document.createElement('input'));
  const lastName = useRef(document.createElement('input'));
  const email = useRef(document.createElement('input'));
  const password = useRef(document.createElement('input'));
  const confirmPassword = useRef(document.createElement('input'));
  const school = useRef(document.createElement('input'));
  const birthday = useRef(document.createElement('input'));

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const birthDay = new Date(birthday.current.value);
    if (password.current.value !== confirmPassword.current.value) {
      setPasswordError(true);
      return;
    }
    let newUser: RegisterUserType = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      email: email.current.value,
      password: password.current.value,
      school: school.current.value,
      birthday: birthDay,
      photoURL : 'https://i.imgur.com/q0GLsDP.jpeg'
    };
    try {
      await dispatch(registerUser(newUser)).unwrap();
      navigate('/auth/schedule');
    } catch (error: any) {
      let errorMessage: string = error.response.data.error;
      setEmailError(errorMessage);
    }
    form.current.reset();
    console.log(newUser);
  };

  return (
    <form onSubmit={formHandler}>
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
              ref={lastName}
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
              ref={email}
              type="email"
              id="email"
              className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                emailError ? 'border-rose-500' : ''
              }`}
              placeholder="johndoe@gmail.com"
              required
            />
            {emailError && (
              <span className="text-xs text-red-500">{emailError}</span>
            )}
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
              ref={password}
              type="password"
              id="password"
              className={`block w-full rounded-lg border ${
                passwordError ? 'border-rose-500' : ' border-gray-300'
              } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
              placeholder="•••••••••"
              required
            />
            {passwordError && (
              <span className="text-xs text-red-500">
                Password and confirm password aren't match
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              ref={confirmPassword}
              type="password"
              id="confirm_password"
              className={`block w-full rounded-lg border ${
                passwordError ? 'border-rose-500' : ' border-gray-300'
              } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
              placeholder="•••••••••"
              required
            />
            {passwordError && (
              <span className="text-xs text-red-500">
                Password and confirm password don't match
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="School"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              School
            </label>
            <input
              ref={school}
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
              ref={birthday}
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
        type="submit"
        className="w-full rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
      >
        Submit
      </button>
    </form>
  );
}

export default SignUpForm;
