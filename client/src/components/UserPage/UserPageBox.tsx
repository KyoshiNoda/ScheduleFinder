import {
  useGetPendingFriendRequestsQuery,
  useGetUserFriendsQuery,
  useGetUserFriendRequestsQuery,
} from '../../redux/services/user/userService';
import { calculateAge } from '../../utils/functions';
import FriendStatusButton from '../Globals/FriendStatusButton';
import { Button } from 'flowbite-react';
import { User as UserType } from '../../types';
type UserPageBoxProps = {
  userId: string;
  userInfo: UserType;
};
const UserPageBox = ({ userId, userInfo }: UserPageBoxProps) => {
  const { data: sentFriendRequests } = useGetPendingFriendRequestsQuery('User');
  const { data: receivedFriendRequests } = useGetUserFriendRequestsQuery('User');
  const { data: friends } = useGetUserFriendsQuery('User');

  const isPending = sentFriendRequests?.some((friend: any) => friend._id === userId);
  const isFriendRequest = receivedFriendRequests?.some((friend: any) => friend._id === userId);
  const isFriends = friends?.some((friend: any) => friend._id === userId);
  return (
    <div className="w-full lg:w-2/5 flex h-5/6 flex-col mt-12 lg:mt-20 rounded-lg bg-white border dark:border-none shadow dark:shadow-none p-4 dark:bg-slate-800 dark:text-white lg:mx-0 lg:ml-10">
      <div className="flex flex-col items-center gap-3">
        <img src={userInfo.photoURL} className="h-44 w-44 rounded-full border-2" />
        <h1 className="mb-4 text-2xl font-bold">
          {userInfo.firstName} {userInfo.lastName}
        </h1>
      </div>
      <div className="w-7/8 flex h-1/2 flex-col gap-4 rounded-lg bg-slate-200 p-5 text-lg font-medium  dark:bg-slate-900">
        <div>
          <p>Age: {calculateAge(new Date(userInfo.birthday))}</p>
          <p>School: {userInfo.school}</p>
          <p>Major: {userInfo.major}</p>
        </div>
        <div>
          <h1 className="mb-4">Hobbies:</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {userInfo.hobbies.map((hobby) => (
              <Button color="blue" pill className="w-20">
                {hobby}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <span className="cursor-pointer font-normal underline">See More</span>
        </div>
        <div className="flex w-full justify-center">
          <FriendStatusButton
            isPending={isPending}
            isFriendRequest={isFriendRequest}
            isFriends={isFriends}
            userID={userId!}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPageBox;
