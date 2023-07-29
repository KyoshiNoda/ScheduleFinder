import { useState, useEffect } from 'react';
import { useGetUserFriendQuery } from '../../../redux/services/user/userService';
import { User as UserType } from '../../../types';
function FriendsTab() {
  const { data, isLoading } = useGetUserFriendQuery('User');
  const [friends, setFriends] = useState<UserType[]>();

  useEffect(() => {
    if (data && !isLoading) {
      setFriends(data);
    }
  }, [data, isLoading]);

  const onFriendClicked = (id: string) => {
    console.log(id);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded dark:text-white">
      {friends ? (
        friends.map((friend) => {
          return (
            <div key={friend._id} className="flex w-full gap-10">
              <div
                className="flex w-full cursor-pointer gap-4"
                onClick={() => onFriendClicked(friend._id)}
              >
                <img
                  alt=""
                  className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500"
                  src={friend.photoURL}
                />
                <div className="flex flex-col justify-center">
                  <div className="flex text-xl">
                    {friend.firstName} {friend.lastName}
                  </div>
                  <div className="text-blue-700 dark:text-gray-400">
                    {friend.school}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-3 py-3 font-semibold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>still rendering</div>
      )}
    </div>
  );
}

export default FriendsTab;
