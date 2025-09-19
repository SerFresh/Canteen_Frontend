import { ChevronLeft, BookOpenText, PencilLine, Mail, Lock, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6">
      {/* Top Section */}
      <div className="flex flex-row justify-between items-center mt-4 w-full">
        <div className="flex items-center gap-3 max-w-[70%]">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-gray-500 text-sm">Manage your account and change password</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {/* User Manual */}
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
            <BookOpenText className="w-6 h-6 text-gray-700" />
          </button>

          {/* Edit Profile */}
        <Link
          to="/editprofile"
          className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90"
        >
          <PencilLine className="w-6 h-6 text-white" />
        </Link>
      </div>
    </div>
      {/* Profile Card */}
      <div className="flex flex-col items-center mt-20 sm:mt-10">
        <div className="bg-white border rounded-2xl shadow p-6 sm:p-8 w-full max-w-sm text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-500 flex items-center justify-center">
              {user.imageProfile ? (
                <img src={user.imageProfile} alt="avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" />
              ) : (
                <UserRound className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              )}
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold mb-4">{user.name || "No name"}</h2>
          <hr className="my-4" />

          {/* Info */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <UserRound className="w-5 h-5 text-orange-500" />
              <span>{user.nickname || "No nickname"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              <span>********</span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
