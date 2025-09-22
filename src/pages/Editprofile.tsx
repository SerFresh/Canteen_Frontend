import { useEffect, useState } from "react";
import { ChevronLeft, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface FormState {
  name: string;
  nickname: string;
  imageFile?: File;
}

export default function EditProfile() {
  const { user, setUser } = useUser();
  const [form, setForm] = useState<FormState>({ name: "", nickname: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setForm({ name: user.name, nickname: user.nickname });
  }, [user]);

  const handleSave = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("nickname", form.nickname);
    if (form.imageFile) formData.append("image", form.imageFile);

    setSaving(true);
    fetch("https://canteen-backend-igyy.onrender.com/api/user/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then(res => res.json())
      .then(updatedUser => {
        console.log("Updated user:", updatedUser); // เพิ่มตรงนี้
        setUser(updatedUser);
        setSaving(false);
        navigate("/profile");
      })
      .catch(err => {
        console.error("Error updating profile:", err);
        setSaving(false);
      });

  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <div className="max-w-md mx-auto bg-white border rounded-2xl shadow p-6 sm:p-8 space-y-4">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
            {form.imageFile ? (
              <img src={URL.createObjectURL(form.imageFile)} alt="avatar preview" className="w-full h-full object-cover" />
            ) : user.imageProfile ? (
              <img src={user.imageProfile} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserRound className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        {/* Upload file */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setForm({ ...form, imageFile: e.target.files[0] });
              }
            }}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Nickname */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Nickname</label>
          <input
            type="text"
            value={form.nickname}
            onChange={e => setForm({ ...form, nickname: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Change Password</label>
          <button
            onClick={() => (window.location.href = "/change-password")}
            className="bg-[#FF8001] hover:bg-[#FBC02D] text-white font-semibold px-4 py-2 rounded-lg mt-1"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>


        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
