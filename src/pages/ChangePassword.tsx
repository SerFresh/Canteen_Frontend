import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("คุณยังไม่ได้ login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://canteen-backend-ten.vercel.app/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "เกิดข้อผิดพลาด");
      } else {
        setMessage(data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#FF8001] to-[#FBC02D] px-4">
            <div className="fixed">
        <button onClick={() => navigate(-1)} className="">
          <ChevronLeft className="w-10 h-10 ml-10 mt-10 text-icon" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center w-screen px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">เปลี่ยนรหัสผ่าน</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="รหัสเก่า"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          <input
            type="password"
            placeholder="รหัสใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          <input
            type="password"
            placeholder="ยืนยันรหัสใหม่"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8001]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
