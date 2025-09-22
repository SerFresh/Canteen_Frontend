import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ReservationPage() {
  const { tableId } = useParams(); // รับ tableId จาก url เช่น /reserve/:tableId
  const navigate = useNavigate();
  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReservation = async () => {
    const token = localStorage.getItem("token"); // ต้องมี token ตอน login
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนจองโต๊ะ");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${tableId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ต้องส่ง token
          },
          body: JSON.stringify({ duration: Number(duration) }), // ส่งเวลาไป
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "การจองล้มเหลว");
      }

      alert("จองโต๊ะสำเร็จ!");
      navigate("/"); // กลับไปหน้าแรกหรือหน้าโต๊ะ
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h1 className="text-xl font-bold mb-4">จองโต๊ะ</h1>

      <p className="mb-2">เลือกเวลา:</p>
      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="10">10 นาที</option>
        <option value="15">15 นาที</option>
      </select>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleReservation}
        disabled={loading}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "กำลังจอง..." : "ยืนยันการจอง"}
      </button>
    </div>
  );
}
