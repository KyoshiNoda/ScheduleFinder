import { AiOutlineCheck } from 'react-icons/ai';
import { useGetUserFriendRequestsQuery, useAcceptFriendRequestMutation, useRejectFriendRequestMutation } from '../redux/services/user/userService';
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
    <div className="flex min-h-full w-screen flex-col bg-gray-50 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="text-bold flex justify-center text-3xl dark:text-white">Friend Requests</div>
      <div className="flex justify-center">
        <div className="flex w-full flex-col items-center rounded-lg bg-white border shadow dark:border-none dark:shadow-none pt-3 dark:bg-slate-800 lg:h-1/2 lg:w-1/2">
          {!isFetching ? (
            data.map((user: any) => {
              return (
                <div className="mb-3 flex w-2/3 gap-4" key={user._id}>
                  <img
                    className="h-11 w-11 rounded-full border shadow-lg dark:border-gray-700 dark:bg-gray-500"
                    src={user.photoURL}
                    alt="user image"
                  />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <div className=" text-sm text-blue-600 dark:text-blue-500">{user.school}</div>
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
                </div>
              );
            })
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsListPage;
