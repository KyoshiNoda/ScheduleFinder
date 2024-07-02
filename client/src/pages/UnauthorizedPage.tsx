import { NavLink } from 'react-router-dom';
import { TbLockOpenOff } from 'react-icons/tb';
const UnauthorizedPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight dark:text-white lg:text-9xl">
            401
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Unauthorized
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Access denied due invalid credentials
          </p>
          <div className="flex justify-center">
            <TbLockOpenOff size={96} />
          </div>
          <div className='flex justify-center'>
            <NavLink
              to="/login"
              className="my-4 flex w-1/2 justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Login Here
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
