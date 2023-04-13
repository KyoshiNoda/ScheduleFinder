import { Button, Dropdown, Avatar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { logout } from '../redux/feats/auth/authSlice';
type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  photoURL?: string;
  age?: number;
  school?: string;
  major?: string;
};
type Props = {
  user: User;
};

const Navbar = (props: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between p-4 shadow dark:bg-slate-800">
      <a href="#" className="flex items-center">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ScheduleFinder
        </span>
      </a>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User avatar dropdown menu"
              img={props.user.photoURL}
              rounded={true}
              size={'md'}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {props.user.firstName} {props.user.lastName}
            </span>
            <span className="block truncate text-sm font-medium">
             {props.user.email}
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
          <Link to={'/'} onClick={() => {dispatch(logout())}}>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Link>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
