import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Account from './pages/Account';
import Schedule from './pages/Schedule';
import FindUser from './pages/FindUser';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/findUsers" element={<FindUser />} />
      </Routes>
    </>
  );
}

export default App;
