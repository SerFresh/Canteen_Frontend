import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import Logo from "../assets/logo.png";

export default function Home() {
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);

  // state สำหรับภาษา (เผื่อไว้เพราะคุณใช้ t.xxx อยู่)
  const [lang, setLang] = useState("th");

  // ตัวอย่างข้อความ 2 ภาษา
  const t = {
    th: {
      allCanteen: "โรงอาหารทั้งหมด",
      welcome: "ยินดีต้อนรับ",
      name: "ผู้ใช้",
    },
    en: {
      allCanteen: "All Canteens",
      welcome: "Welcome",
      name: "User",
    },
  }[lang];

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch(
          "https://canteen-backend-ten.vercel.app/api/canteen/"
        );
        const data = await res.json();
        setCanteens(data);
      } catch (err) {
        console.error("Error fetching canteens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  // สมมติว่าเราเก็บ token ตอน login ลง localStorage
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div>
          <img src={Logo} alt="Logo" className="h-10 w-32 object-contain" />
        </div>

        {/* All Canteen */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-semibold text-lg">
          {t.allCanteen}
        </h1>

        {/* Language + Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="flex items-center border rounded-full overflow-hidden text-sm">
            <button
              onClick={() => setLang("th")}
              className={`px-2 py-1 ${
                lang === "th" ? "bg-orange-400 text-white" : "bg-gray-200"
              }`}
            >
              TH
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 ${
                lang === "en" ? "bg-orange-400 text-white" : "bg-gray-200"
              }`}
            >
              EN
            </button>
          </div>

          {/* Profile */}
          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className="p-2 border rounded-full hover:bg-gray-100"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Welcome text */}
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          {t.welcome}{" "}
          <span className="text-orange-500 font-semibold">{t.name}</span>
        </p>

        {/* Canteen list */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {loading ? (
            <p className="text-gray-500 text-center">กำลังโหลด...</p>
          ) : (
            canteens.map((c) => (
              <Link
                key={c._id}
                to={`/canteen/${c._id}`}
                className="flex justify-between items-center border-2 rounded-xl px-4 py-3 shadow hover:bg-gray-50 transition"
                style={{
                  borderColor:
                    c.status === "High"
                      ? "red"
                      : c.status === "Medium"
                      ? "orange"
                      : "green",
                }}
              >
                <span>{c.name}</span>
                <span>
                  {c.blockedTables ?? 0}/{c.totalTables ?? 50}
                </span>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
