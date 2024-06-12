import { Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import SchedulePage from './pages/SchedulePage';
import FindUserPage from './pages/FindUserPage';
import CompareSchedulePage from './pages/CompareSchedulePage';
import PageLayout from './components/PageLayout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotificationsListPage from './pages/NotificationsListPage';
import UserProfilePage from './pages/UserProfilePage';
import FriendsListPage from './pages/FriendsListPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/auth" element={<PageLayout />}>
          <Route path="account" element={<AccountPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="friends" element={<FriendsListPage />} />
          <Route path="findUsers" element={<FindUserPage />} />
          <Route path="compareSchedule/:userId" element={<CompareSchedulePage />} />
          <Route path="notifications" element={<NotificationsListPage />} />
          <Route path ="user/:userId" element={<UserProfilePage />} />
        </Route>
      </Routes> 
    </>
  );
}

export default App;
