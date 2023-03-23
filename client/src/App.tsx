import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Account from './pages/Account';
import Schedule from './pages/Schedule';
import PageLayout from './components/PageLayout';

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<PageLayout />}>
          <Route path="account" element={<Account />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
