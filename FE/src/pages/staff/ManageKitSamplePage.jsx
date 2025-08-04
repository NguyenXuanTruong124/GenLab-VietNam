import React, { useState, useEffect } from "react";
import FlowAtClinic from "./FlowAtClinic";
import FlowAtHome from "./FlowAtHome";
import FlowStaffVisit from "./FlowStaffVisit";
import axios from "axios";
import NewBookingNotifier from "./NewBookingNotifier";

export default function ManageKitSamplePage() {
  const [flow, setFlow] = useState("clinic"); // "clinic" | "home" | "staffHome"
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);

  useEffect(() => {
    if (showCompleted) {
      axios.get("http://localhost:3001/api/staff/booking", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(res => {
        setCompletedBookings(res.data.filter(b => b.Booking_Status === 'Hoàn tất'));
      });
    }
  }, [showCompleted]);

  return (
    <div>
      <NewBookingNotifier />
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFlow("clinic")} style={{ marginRight: 8, background: flow === "clinic" ? '#1976d2' : '#eee', color: flow === "clinic" ? '#fff' : '#333' }}>Tại cơ sở y tế</button>
        <button onClick={() => setFlow("home")} style={{ marginRight: 8, background: flow === "home" ? '#1976d2' : '#eee', color: flow === "home" ? '#fff' : '#333' }}>Tự lấy mẫu tại nhà</button>
        <button onClick={() => setFlow("staffHome")} style={{ marginRight: 8, background: flow === "staffHome" ? '#1976d2' : '#eee', color: flow === "staffHome" ? '#fff' : '#333' }}>Nhân viên đến nhà</button>
        <button onClick={() => setShowCompleted(true)} style={{ background: showCompleted ? '#1976d2' : '#eee', color: showCompleted ? '#fff' : '#333', marginLeft: 16 }}>Xem đơn hoàn tất</button>
      </div>
      {flow === "clinic" && <FlowAtClinic />}
      {flow === "home" && <FlowAtHome />}
      {flow === "staffHome" && <FlowStaffVisit />}
      {showCompleted && (
        <div style={{ marginTop: 32, background: '#f9f9f9', border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Danh sách đơn đã hoàn tất</h3>
            <button onClick={() => setShowCompleted(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Đóng</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Mã Booking</th>
                <th>Tên khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Loại dịch vụ</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>Không có đơn hoàn tất nào.</td></tr>
              ) : completedBookings.map(b => (
                <tr key={b.Booking_ID}>
                  <td>{b.Booking_ID}</td>
                  <td>{b.CustomerName || '-'}</td>
                  <td>{b.BookingDate ? new Date(b.BookingDate).toLocaleDateString('vi-VN') : '-'}</td>
                  <td>{b.Booking_Status}</td>
                  <td>{b.Service_Names || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
