import { useState, useEffect } from 'react';
import { User as UserType, Schedule as ScheduleType } from '../types';
import { useGetExternalUserInfoQuery } from '../redux/services/user/userService';
import { useGetExternalScheduleQuery } from '../redux/services/schedule/scheduleService';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { useParams } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { calculateAge } from '../utils/functions';
import { Button } from 'flowbite-react';
import ScheduleBox from '../components/Schedule/ScheduleBox';
const UserPage = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  dispatch(toggleReadOnly(true));
  const { data: userData, isLoading: userLoading } = useGetExternalUserInfoQuery(userId!);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetExternalScheduleQuery(userId!);
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleType | undefined>();
  const dummyTags: string[] = ['Basketball', 'Football', 'Soccer', 'Tennis', 'Golf'];

  useEffect(() => {
    if (userData && !userLoading && scheduleData && !scheduleLoading) {
      setUserInfo(userData);
      setScheduleInfo(scheduleData);
      console.log(scheduleInfo);
    }
  }, [userData, userLoading, scheduleData, scheduleLoading]);
  return (
    <>
      {userInfo ? (
        <div className="flex min-h-full w-screen flex-col gap-20 bg-slate-400 pr-10 dark:bg-slate-900 lg:flex-row">
          <div className="min-w-1/4 ml-10 flex h-5/6 flex-col rounded-lg bg-white p-4 dark:bg-slate-800 dark:text-white">
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
          <div className="flex w-full flex-col gap-10 text-center">
            <h1 className="text-3xl font-semibold text-white">Schedule:</h1>
            <ScheduleBox timeSlots={scheduleInfo!.timeSlots} />
          </div>
        </div>
      ) : (
        <Spinner aria-label="Profile loading spinner" size="xl" />
      )}
    </>
  );
};

export default UserPage;
