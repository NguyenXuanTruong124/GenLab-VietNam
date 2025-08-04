// Chức năng cơ bản của file này là dùng để  Khi vào trang, lưu lại danh sách booking hiện tại.
// Định kỳ (setInterval), gọi lại API booking.
// Nếu phát hiện có booking mới (so với danh sách cũ), hiển thị thông báo/toast (ví dụ: "Có đơn mới!").
// Có thể dùng thư viện như react-toastify hoặc tự custom 1 thông báo nhỏ.

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function NewBookingNotifier({ onNewBooking }) {
  const [show, setShow] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const lastBookingIds = useRef([]);

  useEffect(() => {
    let mounted = true;
    const fetchAndCheckNewBooking = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/staff/booking", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const activeBookings = res.data.filter(b => b.Booking_Status !== 'Hoàn tất');
        const currentIds = activeBookings.map(b => b.Booking_ID);
        if (lastBookingIds.current.length > 0) {
          const newOnes = currentIds.filter(id => !lastBookingIds.current.includes(id));
          if (newOnes.length > 0 && mounted) {
            // Lấy booking mới nhất
            const newBooking = activeBookings.find(b => b.Booking_ID === newOnes[0]);
            let type = "";
            if (newBooking?.Service_Names) {
              if (newBooking.Service_Names.includes("tại cơ sở y tế") || newBooking.Service_Names.includes("Hành chính")) {
                type = "tại cơ sở y tế";
              } else if (newBooking.Service_Names.includes("tự lấy mẫu tại nhà")) {
                type = "tự lấy mẫu tại nhà";
              } else if (newBooking.Service_Names.includes("đến nhà lấy mẫu")) {
                type = "nhân viên đến nhà";
              }
            }
            setServiceType(type);
            setShow(true);
            if (onNewBooking) onNewBooking(newOnes);
            setTimeout(() => setShow(false), 5000);
          }
        }
        lastBookingIds.current = currentIds;
      } catch (err) { /* ignore */ }
    };
    fetchAndCheckNewBooking();
    const interval = setInterval(fetchAndCheckNewBooking, 15000);
    return () => { mounted = false; clearInterval(interval); };
  }, [onNewBooking]);

  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, background: "#1976d2", color: "#fff",
      padding: "12px 24px", borderRadius: 8, zIndex: 9999, boxShadow: "0 2px 8px #0002"
    }}>
      {`Có đơn${serviceType ? ` (${serviceType})` : ""} mới!`} <span role="img" aria-label="bell">🔔</span>
    </div>
  );
} 