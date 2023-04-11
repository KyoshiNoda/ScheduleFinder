import { ChangeEvent, FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/feats/auth/authActions';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';

type Props = {};
function LoginForm(props: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const formHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch({ type: 'api/users', payload: loginUser({email,password}) });
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
            className="w-full rounded-md border-gray-100 bg-gray-50 px-4 py-3 text-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400"
          />
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
            className="w-full rounded-md border-gray-100 bg-gray-50 px-4 py-3 text-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400"
          />
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

// Axios.post('http://localhost:3001/api/auth/login', {
//   email: email,
//   password: password,
// })
//   .then((res) => {
//     alert('correct password');
//     console.log(res.data);
//   })
//   .catch((err) => {
//     alert('wrong password');
//   });
