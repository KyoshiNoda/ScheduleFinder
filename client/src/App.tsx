import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Homepage from './pages/LandingPage';
import Login from './pages/Login';
import Account from './pages/Account';
import Schedule from './pages/Schedule';
import FindUser from './pages/FindUser';
import CompareSchedule from './pages/CompareSchedule';
import PageLayout from './components/PageLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/auth" element={<PageLayout />}>
          <Route path="account" element={<Account />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="findUsers" element={<FindUser />} />
          <Route path="compareSchedule/:userId" element={<CompareSchedule />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
