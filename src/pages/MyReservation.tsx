import { useEffect, useState } from "react";

interface Reservation {
  _id: string;
  tableId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("กรุณาเข้าสู่ระบบก่อนดูการจอง");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://canteen-backend-igyy.onrender.com/api/reservation/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลการจองได้");
        }

        const data = await res.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">การจองของฉัน</h1>
      {reservations.length === 0 ? (
        <p>ยังไม่มีการจอง</p>
      ) : (
        <ul className="space-y-2">
          {reservations.map((r) => (
            <li
              key={r._id}
              className="p-3 border rounded-lg shadow-sm bg-white"
            >
              <p>
                <span className="font-semibold">โต๊ะ:</span> {r.tableId}
              </p>
              <p>
                <span className="font-semibold">สถานะ:</span> {r.status}
              </p>
              <p className="text-sm text-gray-500">
                สร้างเมื่อ: {new Date(r.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
