import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { User, ChevronLeft } from "lucide-react";
import Logo from "../assets/logo.png";

interface HeaderProps {
  lang: "th" | "en";
  setLang: (lang: "th" | "en") => void;
  isLoggedIn: boolean;
}

interface UserData {
  imageProfile?: string;
}

interface Canteen {
  _id: string;
  name: string;
}

interface Params {
  canteenId?: string;
}

export default function Header({ lang, setLang, isLoggedIn }: HeaderProps) {
    const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const { canteenId } = useParams<Params>();
  const location = useLocation();

    useEffect(() => {
      const fetchCanteen = async () => {
        if (!canteenId) return;
        try {
          const res = await fetch(`https://canteen-backend-ten.vercel.app/api/canteen/${canteenId}`);
          const data: Canteen = await res.json();
          setCanteen(data);
        } catch (err) {
          console.error(err);
        } 
      };
      fetchCanteen();
    }, [canteenId]);


    const pageTitle = (() => {
        if (location.pathname === "/") {
            return lang === "th" ? "โรงอาหารทั้งหมด" : "All Canteens";
        }
        if (location.pathname === "/profile") {
            return lang === "th" ? "โปรไฟล์ของฉัน" : "My Profile";
        }
        // ตรวจสอบ path แบบ dynamic สำหรับ /canteen/:canteenId
        if (canteenId && location.pathname.startsWith("/canteen/")) {
            return lang === "th"
            ? `โรงอาหาร ${canteen?.name ?? ""}`
            : `Canteen ${canteen?.name ?? ""}`;
        }
        return "";
        })();

        const pageLogo = (() => {
        if (location.pathname === "/") {
            return  <div>
                        <img src={Logo} alt="Logo" className="h-10 w-16 object-contain" />
                    </div>;
        }
        return  <button onClick={() => navigate("/")} className="">
                    <ChevronLeft className="w-8 h-8 ml-5 text-icon" />
                </button>;
        })();


    const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://canteen-backend-ten.vercel.app/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [isLoggedIn, token]);

  return (
    <header className="font-thai relative flex items-center justify-between p-4 border-b min-h-20">
      {/* Logo */}
        <div>
          {pageLogo}
        </div>

      {/* All Canteen */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-semibold text-lg">
        {pageTitle}
      </h1>

      {/* Language + Profile */}
      <div className="flex items-center gap-2">
        {/* Language Switch */}
        <div className="flex items-center border rounded-full overflow-hidden text-sm">
          <button
            onClick={() => setLang("th")}
            className={`px-2 py-1 ${lang === "th" ? "bg-orange-400 text-white" : "bg-gray-200"}`}
          >
            TH
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 ${lang === "en" ? "bg-orange-400 text-white" : "bg-gray-200"}`}
          >
            EN
          </button>
        </div>

        {/* Profile */}
        <Link
        to={isLoggedIn ? "/profile" : "/login"}
        className="rounded-full border overflow-hidden w-11 h-11 flex items-center justify-center hover:bg-gray-100"
        >
        {user?.imageProfile ? (
            <img
            src={user.imageProfile}
            alt="User Avatar"
            className="h-full w-full object-cover rounded-full"
            />
        ) : (
            <User className="w-5 h-5" />
        )}
        </Link>
      </div>
    </header>
  );
}
