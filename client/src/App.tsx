import { Route, Routes } from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/Signup"
import Homepage from "./pages/Homepage"
function App() {
    return (
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
  )
}

export default App
