import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface ForgotPasswordResponse {
  message: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://canteen-backend-igyy.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data: ForgotPasswordResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "เกิดข้อผิดพลาด");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-thai flex h-screen bg-gradient-to-r from-[#FF8001] to-[#FBC02D]">
      <div className="fixed">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-10 h-10 ml-10 mt-10 text-icon" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center w-screen px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">ลืมรหัสผ่าน</h1>

          {message && <p className="text-center text-red-500 mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "กำลังส่งลิงก์..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
