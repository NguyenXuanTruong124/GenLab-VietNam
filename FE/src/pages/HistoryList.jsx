import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../skin_web/HistoryList.css";

const HistoryList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      setPaymentMessage(
        "Thanh toán thành công! Trạng thái đơn hàng của bạn đã được cập nhật."
      );
      navigate("/lich-su", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      setError("Không tìm thấy thông tin tài khoản! Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3001/api/booking/user/${user.email}`)
      .then((res) => setBookings(res.data))
      .catch(() => setError("Không thể tải lịch sử đặt hẹn"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="history-list-container">
      {paymentMessage && (
        <div className="payment-message success">{paymentMessage}</div>
      )}

      <h2>Lịch sử đặt xét nghiệm</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Kết quả</th>
            <th>Nhân viên phụ trách</th>
            <th>Ngày nhận kết quả</th>
            <th>Hình thức nhận kết quả</th>
            <th>Đánh giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => {
              // Xác định có phải dịch vụ tại nhà hoặc tự lấy mẫu không (để hiển thị thông tin bổ sung)
              const isHomeService = b.Service_Names && (
                b.Service_Names.includes("tự lấy mẫu tại nhà") ||
                b.Service_Names.includes("đến nhà lấy mẫu")
              );
              return (
                <tr key={b.Booking_ID}>
                  <td>{b.Booking_ID}</td>
                  <td>{new Date(b.BookingDate).toLocaleDateString("vi-VN")}</td>
                  <td
<<<<<<< HEAD
                    className={`status-cell ${b.Booking_Status === "Đã xác nhận" ||
                      b.Booking_Status === "Hoàn tất"
                      ? "confirmed"
                      : ""
                      }`}
=======
                    className={`status-cell ${
                      b.Booking_Status === "Đã xác nhận" ||
                      b.Booking_Status === "Hoàn tất"
                        ? "confirmed"
                        : ""
                    }`}
>>>>>>> 2d0b93a83c3ad778ee1e508371a19b4c54a78139
                  >
                    {b.Booking_Status}
                  </td>

                  <td>
<<<<<<< HEAD
                    {b.Booking_Status === "Hoàn tất" && (b.TestResult || b.Result_PDF_URL) ? (
                      <div className="result-container">
                        {b.TestResult && (
                          <div className="test-result-text">{b.TestResult}</div>
                        )}
                        {b.Result_PDF_URL && (
                          <a
                            href={`http://localhost:3001${b.Result_PDF_URL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-result-link"
                          >
                            Tải Kết Quả (PDF)
                          </a>
                        )}
                      </div>
=======
                    {b.Booking_Status === "Hoàn tất" && b.Result_PDF_URL ? (
                      <a
                        href={`http://localhost:3001${b.Result_PDF_URL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-result-link"
                      >
                        Tải Kết Quả (PDF)
                      </a>
>>>>>>> 2d0b93a83c3ad778ee1e508371a19b4c54a78139
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Nhân viên phụ trách */}
                  <td>{b.Staff_Name || "-"}</td>

                  {/* Ngày nhận kết quả */}
                  <td>{b.ReceiveDate ? new Date(b.ReceiveDate).toLocaleDateString("vi-VN") : "-"}</td>

                  {/* Hình thức nhận kết quả + shipping status nếu gửi về địa chỉ */}
                  <td>
                    {b.ReceiveResult === "Gửi về địa chỉ"
                      ? (
                        <>
                          Gửi về địa chỉ
                          {b.Shipping_Status ? (
                            <span style={{ display: 'block', fontSize: 12, color: '#1976d2' }}>
                              {b.Shipping_Status}
                            </span>
                          ) : null}
                        </>
                      )
                      : (b.ReceiveResult || "-")}
                  </td>

                  {/* CỘT ĐÁNH GIÁ - trỏ đúng đến /danh-gia */}
                  <td>
                    {b.Booking_Status === "Hoàn tất" ? (
                      <button onClick={() => navigate(`/danh-gia/${b.Booking_ID}`)}>Đánh giá</button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {b.Booking_Status === "Chờ xác nhận" ? (
                      <button
                        onClick={() => navigate(`/lich-su/${b.Booking_ID}`)}
                        className="action-button pay-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
                          <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
                        </svg>
                        <span>Xem & Thanh toán</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/lich-su/${b.Booking_ID}`)}
                        className="action-button details-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z" />
                          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                        </svg>
                        <span>Xem chi tiết</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="no-bookings-row">
              <td colSpan="9">Bạn chưa có lịch đặt nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryList;
