// components/VerifyPopup.tsx
import { useEffect, useState } from "react";
import * as jwt_decode from "jwt-decode";

interface VerifyPopupProps {
  token: string;
  onClose: () => void;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export default function VerifyPopup({ token, onClose }: VerifyPopupProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // default 60 วินาที

  useEffect(() => {
    if (!token) return;

    try {
      const decoded: JwtPayload = (jwt_decode as any)(token);
      const expiration = decoded.exp * 1000;
      const updateCountdown = () => {
        const diff = expiration - Date.now();
        setTimeLeft(diff > 0 ? Math.floor(diff / 1000) : 0);
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    } catch (err) {
      console.error("Invalid token, using default countdown:", err);
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4 text-orange-600">การยืนยันอีเมล</h2>

        {timeLeft > 0 ? (
          <div>
            <p className="text-gray-700 mb-4">
              ลิงก์ยืนยันจะหมดอายุใน{" "}
              <span className="font-bold text-red-600">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>{" "}
              นาที
            </p>
            <p className="text-gray-700 mb-4">
              กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการลงทะเบียน
            </p>
          </div>
        ) : (
          <div>
          <p className="text-red-600 font-bold mb-4">⏰ ลิงก์หมดอายุแล้ว</p>
            <p className="text-gray-700 mb-4">
              กรุณารอประมาณ 1 นาที เพื่อทำการลงทะเบียนใหม่
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
