import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CanteenDetail() {
  const { canteenId } = useParams();
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanteen = async () => {
      try {
        const res = await fetch(`https://canteen-backend-ten.vercel.app/api/canteen/${canteenId}`);
        const data = await res.json();
        setCanteen(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanteen();
  }, [canteenId]);

  if (loading) return <p className="p-4">กำลังโหลด...</p>;
  if (!canteen) return <p className="p-4 text-red-500">ไม่พบโรงอาหาร</p>;

  return (
    <div className="p-4">
      {/* โรงอาหาร */}
      <h1 className="text-2xl font-bold mb-4">{canteen.name}</h1>

      {/* Zones */}
      {canteen.zones?.map((zone) => (
        <div key={zone._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Zone {zone.name}</h2>

          {/* Tables */}
          <div className="grid grid-cols-3 gap-3">
            {zone.tables?.map((table) => (
              <div
                key={table._id}
                className={`p-3 rounded-lg text-center border font-semibold ${
                  table.status === "Available"
                    ? "bg-green-100 border-green-400"
                    : table.status === "Reserved"
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-red-100 border-red-400"
                }`}
              >
                <p>{table.number}</p>
                <p>{table.status}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
