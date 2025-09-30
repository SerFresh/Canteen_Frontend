import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");

    if (tokenParam) {
      const token = decodeURIComponent(tokenParam); // 🔹 decode ก่อนใช้งาน
      localStorage.setItem("authToken", token);

      // 🔹 ให้ redirect หลังจากเก็บ token เสร็จ
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100); // 100ms เผื่อ async rendering
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}
