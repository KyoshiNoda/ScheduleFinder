import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import Navbar from './Navbar';
import UnauthorizedPage from '../pages/UnauthorizedPage';
const PageLayout = () => {
  const { userToken, userInfo } = useAppSelector((state) => state.auth);
  if (Object.keys(userToken).length === 0) {
    return <UnauthorizedPage />;
  }
  return (
    <>
      <Navbar user={userInfo} />
      <Outlet />
    </>
  );
};

export default PageLayout;
