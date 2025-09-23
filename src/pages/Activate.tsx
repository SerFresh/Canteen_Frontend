import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ActivatePage() {
  const { tableId } = useParams<{ tableId: string }>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleActivate = async () => {
    if (!tableId) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://canteen-backend-igyy.onrender.com/api/reservation/${tableId}/activate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (res.ok) {
        setMessage(`โต๊ะ ${tableId} ถูก Activate เรียบร้อย`);
        navigate("/");
      } else {
        const err = await res.json();
        setMessage(`Activate ล้มเหลว: ${err.message || res.statusText}`);
      }
    } catch (error: any) {
      setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reservation Table: {tableId}</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <button
        onClick={handleActivate}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "กำลัง Activate..." : "Activate"}
      </button>
    </div>
  );
}
