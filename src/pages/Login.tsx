import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Logo from "../assets/logo.png";
import { useUser } from "../contexts/UserContext"; // ใช้ context

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useUser(); // ✅ เอามาใช้

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://canteen-backend-igyy.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ เก็บ token
      localStorage.setItem("authToken", data.token);

      // ✅ ดึงข้อมูล user มาเก็บใน context
      await refreshUser();

      // หรือถ้า API login ส่ง user มาด้วย:
      // setUser(data.user);

      // ✅ redirect ไปหน้า home
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-thai bg-gradient-to-r from-[#FF8001] to-[#FBC02D] h-screen">
      <div className="fixed">
        <button onClick={() => navigate("/")} className="">
          <ChevronLeft className="w-10 h-10 ml-10 mt-10 text-icon" />
        </button>
      </div>

      <div className="flex flex-col items-center min-h-screen px-8">
        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          className="w-32 h-32 mb-6 object-contain mt-7"
        />
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 mt-5">
          <h1 className="text-2xl font-bold text-center mb-6">
            Smart Canteen Log In
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          <p
            onClick={() => navigate("/forgot-password")}
            className="text-right text-sm text-[#FF8001] hover:underline cursor-pointer mb-4"
          >
            Forgot Password ?
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#FF8001] hover:underline">
              Sign Up Here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

