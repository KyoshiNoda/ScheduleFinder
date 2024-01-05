import { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { useGetExternalUserInfoQuery } from '../redux/services/user/userService';
import { useParams } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
const UserPage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetExternalUserInfoQuery(userId!);
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  useEffect(() => {
    if (data && !isLoading) {
      setUserInfo(data);
    }
  }, [data, isLoading]);
  return (
    <>
      {userInfo ? (
        <div>
          {userInfo.firstName} {userInfo.lastName}
        </div>
      ) : (
        <Spinner aria-label="Profile loading spinner" size="xl" />
      )}
    </>
  );
};

export default UserPage;
