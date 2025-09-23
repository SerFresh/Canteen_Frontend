import { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function QrScanner() {
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const handleResult = (result: any) => {
    if (result) {
      const text = result.getText();

      // เช็คว่าเป็นลิงก์หรือไม่
      if (text.startsWith("http://") || text.startsWith("https://")) {
        window.location.href = text; // เปิดลิงก์ทันที
      } else {
        alert(`สแกนได้: ${text}`); // ถ้าไม่ใช่ลิงก์ แค่โชว์ข้อความ
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>

      {/* ปุ่มสลับกล้อง */}
      <button
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() =>
          setFacingMode(facingMode === "user" ? "environment" : "user")
        }
      >
        สลับกล้อง ({facingMode === "user" ? "หน้า" : "หลัง"})
      </button>

      <QrReader
        onResult={(result, error) => {
          if (!!result) handleResult(result);
          if (!!error) console.info(error);
        }}
        constraints={{ facingMode }}
        containerStyle={{ width: "100%" }}
      />
    </div>
  );
}
