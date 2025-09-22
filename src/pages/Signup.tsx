// pages/Regis.tsx
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import VerifyPopup from "../components/VerifyPopup";
import Logo from "../assets/logo.png"

export default function Regis() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://canteen-backend-igyy.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, confirmPassword })
        }
      );

      const data = await res.json();
      console.log("Register response:", data);

      if (!res.ok) {
        setError(data.message || "Something went wrong!");
      } else {
        setSuccess("Account created successfully!");

        // ✅ ใช้ token จริงจาก backend หรือ fallback token
        setVerifyToken(data.token || "dummy-token");
        setShowPopup(true);

        // ถ้าอยาก redirect ไป login หลัง 1.5 วิ
        // setTimeout(() => (window.location.href = "/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Network error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-thai bg-gradient-to-r from-[#FF8001] to-[#FBC02D] min-h-screen">
      <div className="fixed">
        <button onClick={() => (window.location.href = "/")}>
          <ChevronLeft className="w-10 h-10 ml-10 mt-10 text-icon" />
        </button>
      </div>

      <div className="flex flex-col items-center min-h-screen px-8">
        {/* Logo อยู่เหนือ card */}
        <img
          src={Logo} alt="Logo"
          className="w-32 h-32  mb-6 object-contain mt-7"
        />
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 mt-5">
          <h1 className="text-2xl font-bold text-center mb-6">
            Smart Canteen Sign Up
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
              required
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#FF8001] hover:underline">
              Log In Here!
            </a>
          </p>
        </div>
      </div>

      {/* ✅ แสดง popup */}
      {showPopup && verifyToken && (
        <VerifyPopup token={verifyToken} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
