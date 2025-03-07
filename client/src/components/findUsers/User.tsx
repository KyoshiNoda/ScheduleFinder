import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { User as UserType } from '../../types';
import FriendStatusButton from '../Globals/FriendStatusButton';

type UserProps = {
  user: UserType;
  isPending: boolean;
  isFriendRequest: boolean;
  isFriends: boolean;
};
const User = ({ user }: UserProps) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <Card className='bg-rose-400'>
        <div className="flex flex-col items-center">
          <img className="mb-3 max-h-32 w-32 rounded-full object-cover shadow-lg" src={user.photoURL} alt={`Profile picture of ${fullName}`} />
          <h2 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{fullName}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user.major}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user.school}</span>
          <div className="mt-4 flex items-center gap-4">
            <Link
              to={`/auth/user/${user._id}`}
              className="inline-flex h-fit items-center rounded-lg border bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-blue-900  dark:text-white dark:hover:border-gray-700 dark:hover:bg-blue-600 dark:focus:ring-gray-700"
            >
              View Profile
            </Link>
            <Link
              to={`/auth/compareSchedule/${user._id}`}
              className="inline-flex h-fit items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Compare Schedule
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

export default User;
