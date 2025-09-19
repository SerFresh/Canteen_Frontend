import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserProvider } from "./contexts/UserContext"; 

import Layout from "./Layout";
import Home from "./pages/Home";
import CanteenDetail from "./pages/CanteenDetail";
import Login from "./pages/Login";
import Regis from "./pages/Signup";
import LoginSuccess from "./pages/LoginSuccess";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Editprofile from "./pages/Editprofile";

export default function App() {
  const [lang, setLang] = useState<"th" | "en">("th");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "th" || savedLang === "en") {
      setLang(savedLang);
    }

    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleSetLang = (newLang: "th" | "en") => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* กลุ่มที่มี Header */}
          <Route element={<Layout lang={lang} setLang={handleSetLang} isLoggedIn={isLoggedIn} />}>
            <Route path="/" element={<Home />} />
            <Route path="/canteen/:canteenId" element={<CanteenDetail />} />
          </Route>

          {/* กลุ่มที่ไม่มี Header */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Regis />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<Editprofile />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}
