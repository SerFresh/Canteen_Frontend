import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Canteen {
  _id: string;
  name: string;
  status?: "High" | "Medium" | "Low";
  blockedTables?: number;
  totalTables?: number;
}

interface UserData {
  name?: string;
  nickname?: string;
}

interface HomeProps {
  lang: "th" | "en";
}

export default function Home({ lang }: HomeProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  // Fetch canteens
  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch(
          "https://canteen-backend-igyy.onrender.com/api/canteen/",
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                }
              : undefined,
          }
        );
        const data: Canteen[] = await res.json();
        setCanteens(data);
      } catch (err) {
        console.error("Error fetching canteens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
    const interval = setInterval(fetchCanteens, 3000);
    return () => clearInterval(interval);
  }, [token]);

  // Fetch user profile
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://canteen-backend-igyy.onrender.com/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: UserData = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [isLoggedIn, token]);

  const t = {
    th: { welcome: "ยินดีต้อนรับ", name: "ผู้ใช้", loading: "กำลังโหลด..." },
    en: { welcome: "Welcome", name: "User", loading: "Loading..." },
  }[lang];

  return (
    <div className="font-thai bg-white min-h-screen flex flex-col">
      <main className="flex flex-col items-center flex-1 mt-6">
        <p className="text-lg">
          {t.welcome}{" "}
          <span className="text-orange-500 font-semibold">
            {user?.nickname ?? user?.name ?? t.name}
          </span>
        </p>

        <div className="w-full max-w-md mt-6 flex flex-col gap-4 px-6">
          {loading ? (
            <p className="text-gray-500 text-center">{t.loading}</p>
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