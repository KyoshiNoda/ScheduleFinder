import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Account from './pages/Account';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
