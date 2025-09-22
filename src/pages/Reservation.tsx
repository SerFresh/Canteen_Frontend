import { useState } from "react";
import { useParams } from "react-router-dom";

interface ReservationResponse {
  message: string;
  reservation: {
    _id: string;
    tableID: string;
    userID: string;
    duration_minutes: number;
    reserved_at: string;
  };
}

export default function ReservationPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleReservation = async () => {
    const token = localStorage.getItem("authToken");
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ duration_minutes: Number(duration) }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "การจองล้มเหลว");
      }

      const data: ReservationResponse = await res.json();
      setReservationId(data.reservation._id);
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
  if (!reservationId) {
    console.log("reservationId is null, cannot cancel");
    return;
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    setError("กรุณาเข้าสู่ระบบก่อนยกเลิกการจอง");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      `https://canteen-backend-igyy.onrender.com/api/reservation/${reservationId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "ยกเลิกไม่สำเร็จ");
    }
    setShowPopup(false);      // <-- ปิด popup
    setReservationId(null);   // <-- ล้าง reservationId

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleScanQR = () => {
    alert("เปิดกล้องสแกน QR Code (ใส่ QR scanner component ที่นี่)");
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

      {/* Popup ยืนยัน */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4">การจองสำเร็จ!</h2>
            <p className="mb-4">คุณสามารถสแกน QR Code หรือยกเลิกการจองได้</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleScanQR}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                สแกน QR Code
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                ยกเลิกการจอง
              </button>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 text-gray-500 underline"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
