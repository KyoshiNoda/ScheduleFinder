import { Dropdown, Avatar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { logout } from '../redux/feats/auth/authSlice';

const Navbar = ({ user }: any) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between p-4 shadow dark:bg-slate-800">
      <Link to="/auth/schedule" className="flex items-center">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ScheduleFinder
        </span>
      </Link>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User avatar dropdown menu"
              img={user.photoURL}
              rounded={true}
              size={'md'}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {user.firstName} {user.lastName}
            </span>
            <span className="block truncate text-sm font-medium">
              {user.email}
            </span>
          </Dropdown.Header>
          <Link to={'/auth/schedule'}>
            <Dropdown.Item>My Schedule</Dropdown.Item>
          </Link>
          <Link to={'/auth/findUsers'}>
            <Dropdown.Item>Find Users</Dropdown.Item>
          </Link>
          <Link to={'/auth/account'}>
            <Dropdown.Item>Account Settings</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Link
            to={'/'}
            onClick={() => {
              dispatch(logout());
            }}
          >
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Link>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
