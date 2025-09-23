import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

export default function QrScanner() {
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false); // 🔒 ล็อกการสแกน
  const navigate = useNavigate();

  const handleResult = async (result: any) => {
    if (result && !scanned) {
      const tableId = result.getText();
      setScanned(true); // ล็อกการสแกน
      setLoading(true);

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `https://canteen-backend-igyy.onrender.com/api/reservation/${tableId}/checkin`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (res.ok) {
            const data = await res.json();
            if (data.message === "Check-in confirmed") {
                navigate("/");
            } else {
                navigate(`/activate/${tableId}`);
            }
            } else {
            const err = await res.json();
            alert(`เช็คอินล้มเหลว: ${err.message || res.statusText}`);
            navigate("/");
            }
      } catch (error: any) {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>

      <button
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() =>
          setFacingMode(facingMode === "user" ? "environment" : "user")
        }
      >
        สลับกล้อง ({facingMode === "user" ? "หน้า" : "หลัง"})
      </button>

      {loading && <p>กำลังประมวลผล...</p>}

      <QrReader
        onResult={(result, error) => {
          if (!!result) handleResult(result);
          if (!!error) console.info(error);
        }}
        constraints={{ facingMode }}
        containerStyle={{ width: "100%" }}
      />
    </div>
  );
}
