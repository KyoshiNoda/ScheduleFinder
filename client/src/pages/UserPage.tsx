import { useState, useEffect } from 'react';
import { User as UserType, Schedule as ScheduleType } from '../types';
import { useGetExternalUserInfoQuery } from '../redux/services/user/userService';
import { useGetExternalScheduleQuery } from '../redux/services/schedule/scheduleService';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { useParams } from 'react-router-dom';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toast from '../components/Utils/Toast';
import UserPageBox from '../components/UserPage/UserPageBox';
import LoadingUserPage from '../components/UserPage/LoadingUserPage';
const UserPage = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const friendToast = useAppSelector((state: any) => state.globalSlice.toast);
  const { data: userData, isLoading: userLoading } = useGetExternalUserInfoQuery(userId!);
  const { data: scheduleData, isLoading: scheduleLoading } = useGetExternalScheduleQuery(userId!);
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleType | undefined>();

  dispatch(toggleReadOnly(true));
  useEffect(() => {
    if (userData && !userLoading && scheduleData && !scheduleLoading) {
      setUserInfo(userData);
      setScheduleInfo(scheduleData);
    }
  }, [userData, userLoading, scheduleData, scheduleLoading]);
  return (
    <>
      {userInfo ? (
        <div className="flex min-h-full w-screen flex-col gap-20 bg-gray-50 dark:bg-slate-900 lg:flex-row">
          <UserPageBox userId={userId!} userInfo={userInfo} />
          <div className="mr-0 flex w-full flex-col gap-10 px-12 text-center lg:mr-10">
            <h1 className="text-3xl font-semibold dark:text-white">Schedule:</h1>
            <ScheduleBox timeSlots={scheduleInfo!.timeSlots} />
          </div>
        </div>
      ) : (
        <LoadingUserPage />
      )}
      {friendToast.state && <Toast message={friendToast.message} />}
    </>
  );
};

export default UserPage;
