import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://canteen-backend-ten.vercel.app/api/auth/login",
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

      // ✅ redirect หน้า profile (หรือหน้า home)
      navigate("/profile", { replace: true });
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

      <div className="flex items-center justify-center h-screen px-8">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Smart Canteen Log In
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          {/* Forgot Password */}
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-right text-sm text-[#FF8001] hover:underline cursor-pointer mb-4"
          >
            ลืมรหัสผ่าน?
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          {/* Footer */}
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