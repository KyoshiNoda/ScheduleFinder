import { AiOutlineCheck } from 'react-icons/ai';
import {
  useGetUserFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from '../redux/services/user/userService';
import { Spinner } from 'flowbite-react';

const NotificationsListPage = () => {
  const { data, isFetching } = useGetUserFriendRequestsQuery('User');
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();

  const acceptFriendRequestHandler = async (id: string) => {
    try {
      await acceptFriendRequest({ friendID: id });
    } catch (error: any) {
      console.log(error);
    }
  };

  const rejectFriendRequestHandler = async (id: string) => {
    try {
      await rejectFriendRequest({ friendID: id });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-full w-screen flex-col gap-4 bg-gray-50 p-3 dark:bg-slate-900 lg:gap-10">
      <h1 className="text-center text-5xl font-medium dark:text-white">Friend Requests</h1>
      <div className="flex justify-center md:px-20">
        <table className="w-full rounded-xl border bg-white dark:border-none dark:bg-gray-800 md:w-5/6 lg:w-1/2">
          <tbody className="block max-h-[400px] overflow-y-scroll sm:max-h-[600px]">
            {isFetching ? (
              <tr className="flex w-full h-20 items-center justify-center  ">
                <Spinner />
              </tr>
            ) : (
              data.map((user: any, index: number) => (
                <tr
                  key={user._id}
                  className={`flex w-full items-center justify-between ${
                    index !== data.length - 1 &&
                    'border-b border-solid border-gray-300 dark:border-gray-700'
                  } p-2 lg:p-4`}
                >
                  <img
                    className="h-11 w-11 rounded-full border shadow-lg dark:border-gray-700 dark:bg-gray-500"
                    src={user.photoURL}
                    alt="user image"
                  />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <div className="text-sm text-blue-600 dark:text-blue-500">{user.school}</div>
                  </div>
                  <div className="flex-grow" />
                  <div className="m-auto flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded-lg bg-green-600 px-1 py-1 font-semibold text-white hover:bg-green-500"
                      onClick={() => acceptFriendRequestHandler(user._id)}
                    >
                      <AiOutlineCheck />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-600 px-2 text-white hover:bg-rose-500"
                      onClick={() => rejectFriendRequestHandler(user._id)}
                    >
                      X
                    </button>
                  </div>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsListPage;
