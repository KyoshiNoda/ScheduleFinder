import { Dropdown, Avatar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { logout } from '../redux/feats/auth/authSlice';
import { HiLogout } from 'react-icons/hi';
import { FcCalendar } from 'react-icons/fc';
import { MdSettings } from 'react-icons/md';
import { BsSearchHeart } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import FriendRequest from './FriendRequest';
import Toggle from './Toggle';

const Navbar = ({ user }: any) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between p-4 shadow dark:bg-slate-800">
      <Link to="/auth/schedule" className="flex items-center">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ScheduleFinder
        </span>
      </Link>

      <div className="flex gap-10 md:order-2 z-20">
        <div className="flex items-center">
          <Toggle />
        </div>
        <div className="flex items-center">
          <FriendRequest />
        </div>
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
            <span className="block truncate text-sm font-medium">{user.email}</span>
          </Dropdown.Header>
          <Link to={'/auth/schedule'}>
            <Dropdown.Item>
              <FcCalendar size="20" className="mr-2" />
              My Schedule
            </Dropdown.Item>
          </Link>
          <Link to={'/auth/friends'}>
            <Dropdown.Item>
              <FaUserFriends size="20" className="mr-2" />
              Friends
            </Dropdown.Item>
          </Link>
          <Link to={'/auth/findUsers'}>
            <Dropdown.Item>
              <BsSearchHeart size="20" className="mr-2" />
              Find Users
            </Dropdown.Item>
          </Link>
          <Link to={'/auth/account'}>
            <Dropdown.Item>
              <MdSettings size="22" className="mr-2" />
              Settings
            </Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Link
            to={'/'}
            onClick={() => {
              dispatch(logout());
            }}
          >
            <Dropdown.Item>
              <HiLogout size="20" className="mr-2" />
              Sign out
            </Dropdown.Item>
          </Link>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
