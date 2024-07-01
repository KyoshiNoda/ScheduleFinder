import { NavLink, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import Navbar from './Navbar';
const PageLayout = () => {
  const { userToken, userInfo } = useAppSelector((state) => state.auth);
  if (Object.keys(userToken).length === 0) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }
  return (
    <>
      <Navbar user={userInfo} />
      <Outlet />
    </>
  );
};

export default PageLayout;
