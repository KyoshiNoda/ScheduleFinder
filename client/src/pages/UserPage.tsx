import { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { useGetExternalUserInfoQuery } from '../redux/services/user/userService';
import { useParams } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { calculateAge } from '../utils/functions';
import { Button } from 'flowbite-react';
import ScheduleBox from '../components/Schedule/ScheduleBox';
const UserPage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetExternalUserInfoQuery(userId!);
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const dummyTags: string[] = ['Basketball', 'Football', 'Soccer', 'Tennis', 'Golf'];

  useEffect(() => {
    if (data && !isLoading) {
      setUserInfo(data);
    }
  }, [data, isLoading]);
  return (
    <>
      {userInfo ? (
        <div className="flex h-screen w-screen gap-10 bg-slate-400 dark:bg-slate-900">
          <div className="ml-10 flex h-5/6 w-1/4 flex-col rounded-lg bg-white p-4 dark:bg-slate-800 dark:text-white">
            <div className="flex flex-col items-center gap-3">
              <img src={userInfo.photoURL} className="h-44 w-44 rounded-full border-2" />
              <h1 className="mb-4 text-2xl font-bold">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
            </div>
            <div className="w-7/8 flex h-1/2 flex-col gap-4 rounded-lg bg-slate-400 p-5 text-lg font-medium text-white dark:bg-white dark:text-black">
              <div>
                <p>Age: {calculateAge(new Date(userInfo.birthday))}</p>
                <p>School: {userInfo.school}</p>
                <p>Major: {userInfo.major}</p>
              </div>

              <div>
                <h1 className="text-center">Hobbies:</h1>
                <div className="flex flex-wrap gap-2">
                  {dummyTags.map((hobby) => (
                    <Button color="blue" pill>
                      {hobby}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <span className="cursor-pointer font-normal underline">See More</span>
              </div>
            </div>
          </div>
          <ScheduleBox timeSlots={undefined}/>
        </div>
      ) : (
        <Spinner aria-label="Profile loading spinner" size="xl" />
      )}
    </>
  );
};

export default UserPage;
