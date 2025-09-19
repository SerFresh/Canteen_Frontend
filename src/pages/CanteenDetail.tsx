import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ListFilter } from 'lucide-react';

interface Table {
  _id: string;
  number: number | string;
  status: "Available" | "Reserved" | "Unavailable";
}

interface Zone {
  _id: string;
  name: string;
  tables?: Table[];
}

interface Canteen {
  _id: string;
  name: string;
  zones?: Zone[];
}

interface Params {
  canteenId?: string;
}

export default function CanteenDetail() {
 const { canteenId } = useParams<Params>();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Available" | "Reserved" | "Unavailable"
  >("All");

  useEffect(() => {
    const fetchCanteen = async () => {
      if (!canteenId) return;
      try {
        const res = await fetch(
          `https://canteen-backend-ten.vercel.app/api/canteen/${canteenId}`
        );
        const data: Canteen = await res.json();
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

  const allTables = canteen.zones?.flatMap((z) => z.tables || []) || [];
  const usedTables = allTables.filter(
    (t) => t.status === "Reserved" || t.status === "Unavailable"
  );

  const densityPercent = allTables.length
    ? (usedTables.length / allTables.length) * 100
    : 0;

  return (
    <div className="p-4 font-thai">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
  {/* กลุ่มฝั่งซ้าย */}
  <div className="flex items-center gap-4 flex-wrap">
    <span className="text-sm text-gray-700">
      Quantity: {usedTables.length}/{allTables.length}
    </span>

    <ListFilter />

    <select
      value={filterStatus}
      onChange={(e) =>
        setFilterStatus(e.target.value as typeof filterStatus)
      }
      className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
    >
      <option value="All">All</option>
      <option value="Available">Available</option>
      <option value="Reserved">Reserved</option>
      <option value="Unavailable">Unavailable</option>
    </select>
  </div>

  {/* ฝั่งขวา */}
  <DensityStatus densityPercent={densityPercent} />
</div>


      {/* Zones */}
      {canteen.zones?.map((zone) => (
        <div key={zone._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Zone {zone.name}</h2>

          {/* Tables */}
          <div className="grid grid-cols-3 gap-3">
            {zone.tables
              ?.filter(
                (table) =>
                  filterStatus === "All" || table.status === filterStatus
              )
              .map((table) => (
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

// 🧮 Component แสดงระดับ Density
function DensityStatus({ densityPercent }: { densityPercent: number }) {
  let densityLabel = "";
  if (densityPercent < 35) {
    densityLabel = "Normal";
  } else if (densityPercent < 70) {
    densityLabel = "Medium";
  } else {
    densityLabel = "High";
  }

  return (
    <span>
      Density: {densityLabel} ({densityPercent.toFixed(1)}%)
    </span>
  );
}
