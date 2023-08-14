import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import { useAppDispatch } from '../../redux/store';
import { addFriendRequestToast } from '../../redux/feats/globalSlice/globalSlice';
type UserProps = {
  id: string;
  photoURL: string;
  firstName: string;
  lastName: string;
  school: string;
  major: string | undefined;
};

const User = ({
  id,
  photoURL,
  firstName,
  lastName,
  school,
  major,
}: UserProps) => {
  const dispatch = useAppDispatch();
  const fullName = `${firstName} ${lastName}`;
  const friendHandler = () => {
    dispatch(addFriendRequestToast(true));
    setTimeout(() => {
      dispatch(addFriendRequestToast(false));
    }, 5000);
  };

  return (
    <div className="max-w-sm">
      <Card>
        <div className="flex flex-col items-center">
          <img
            className="mb-3 max-h-32 w-32 rounded-full object-cover shadow-lg"
            src={photoURL}
            alt={`Profile picture of ${fullName}`}
          />
          <h2 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {fullName}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {major}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {school}
          </span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <button
              onClick={friendHandler}
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add friend
            </button>
            <Link
              to={`/auth/compareSchedule/${id}`}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              See schedule
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default User;
