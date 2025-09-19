import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Regis from "./pages/Signup";
import LoginSuccess from "./pages/LoginSuccess";
import Profile from "./pages/Profile";
import Editprofile from "./pages/Editprofile";
import { UserProvider } from "./contexts/UserContext"; // เพิ่มตรงนี้
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import CanteenDetail from "./pages/CanteenDetail";

function App() {
  return (
    <UserProvider> {/* ครอบ App ด้วย Provider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Regis />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<Editprofile />} />
          <Route path="/canteen/:canteenId" element={<CanteenDetail />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
