import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

interface CanteenDetailProps {
  lang: "th" | "en";
}

export default function CanteenDetail({ lang }: CanteenDetailProps) {
  const { canteenId } = useParams<Params>();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Available" | "Reserved" | "Unavailable"
  >("All");

  // Translation dictionary
  const t = {
    th: {
      loading: "กำลังโหลด...",
      notFound: "ไม่พบโรงอาหาร",
      quantity: "จำนวน",
      density: "ความหนาแน่น",
      zone: "โซน",
      all: "ทั้งหมด",
      available: "ว่าง",
      reserved: "จองแล้ว",
      unavailable: "ไม่ว่าง",
      normal: "ปกติ",
      medium: "ปานกลาง",
      high: "สูง"
    },
    en: {
      loading: "Loading...",
      notFound: "Canteen not found",
      quantity: "Quantity",
      density: "Density",
      zone: "Zone",
      all: "All",
      available: "Available",
      reserved: "Reserved",
      unavailable: "Unavailable",
      normal: "Normal",
      medium: "Medium",
      high: "High"
    }
  }[lang];

  useEffect(() => {
    const fetchCanteen = async () => {
      if (!canteenId) return;
      try {
        const res = await fetch(
          `https://canteen-backend-igyy.onrender.com/api/canteen/${canteenId}`
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

  if (loading) return <p className="p-4">{t.loading}</p>;
  if (!canteen) return <p className="p-4 text-red-500">{t.notFound}</p>;

  const allTables = canteen.zones?.flatMap((z) => z.tables || []) || [];
  const usedTables = allTables.filter(
    (t) => t.status === "Reserved" || t.status === "Unavailable"
  );

  const densityPercent = allTables.length
    ? (usedTables.length / allTables.length) * 100
    : 0;

  const getStatusText = (status: string) => {
    switch (status) {
      case "Available": return t.available;
      case "Reserved": return t.reserved;
      case "Unavailable": return t.unavailable;
      default: return status;
    }
  };

  return (
    <div className="p-4 font-thai">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        {/* Left side group */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-gray-700">
            {t.quantity}: {usedTables.length}/{allTables.length}
          </span>

          <ListFilter className="w-5 h-5" />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as typeof filterStatus)
            }
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="All">{t.all}</option>
            <option value="Available">{t.available}</option>
            <option value="Reserved">{t.reserved}</option>
            <option value="Unavailable">{t.unavailable}</option>
          </select>
        </div>

        {/* Right side */}
        <DensityStatus densityPercent={densityPercent} lang={lang} />
      </div>

      {/* Zones */}
      {canteen.zones?.map((zone) => (
        <div key={zone._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t.zone} {zone.name}
          </h2>

          {/* Tables */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {zone.tables
              ?.filter(
                (table) =>
                  filterStatus === "All" || table.status === filterStatus
              )
              .map((table) =>
                table.status === "Available" ? (
                  <Link
                    key={table._id}
                    to={`/tables/${table._id}`}
                    className="p-3 rounded-lg text-center border font-semibold bg-green-100 border-green-400 hover:bg-green-200 transition cursor-pointer"
                  >
                    <p className="font-bold">{table.number}</p>
                    <p className="text-sm text-green-700">{getStatusText(table.status)}</p>
                  </Link>
                ) : (
                  <div
                    key={table._id}
                    className={`p-3 rounded-lg text-center border font-semibold ${
                      table.status === "Reserved"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                        : "bg-red-100 border-red-400 text-red-700"
                    }`}
                  >
                    <p className="font-bold">{table.number}</p>
                    <p className="text-sm">{getStatusText(table.status)}</p>
                  </div>
                )
              )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Density Status Component with Language Support
function DensityStatus({ 
  densityPercent, 
  lang 
}: { 
  densityPercent: number;
  lang: "th" | "en";
}) {
  const t = {
    th: {
      density: "ความหนาแน่น",
      normal: "ปกติ",
      medium: "ปานกลาง",
      high: "สูง"
    },
    en: {
      density: "Density",
      normal: "Normal",
      medium: "Medium",
      high: "High"
    }
  }[lang];

  let densityLabel = "";
  if (densityPercent < 35) {
    densityLabel = t.normal;
  } else if (densityPercent < 70) {
    densityLabel = t.medium;
  } else {
    densityLabel = t.high;
  }

  return (
    <span className="text-sm font-medium">
      {t.density}: {densityLabel} ({densityPercent.toFixed(1)}%)
    </span>
  );
}