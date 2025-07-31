import React, { useEffect, useState } from "react";
//import { useParams, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../skin_web/TestingHistory.css"; // Import file CSS

const TestingHistory = () => {
  const { id: bookingId } = useParams();
  //const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({ total: 0, isPaid: false });
  const [loading, setLoading] = useState(true);
  // State này sẽ chỉ hiển thị lỗi từ server
  const [paymentError, setPaymentError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setPaymentError("Không tìm thấy mã đơn hàng trong địa chỉ URL.");
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        // Lấy cả trạng thái và chi tiết đơn hàng
        const [statusRes, detailsRes] = await Promise.all([
          axios.get(
            `http://localhost:3001/api/booking/${bookingId}/status-total`
          ),
          axios.get(`http://localhost:3001/api/booking/${bookingId}/details`),
        ]);

        setBookingInfo({
          total: statusRes.data.total,
          isPaid: statusRes.data.isPaid,
        });
        setDetails(detailsRes.data.details);

        // Lấy ngày tạo booking để kiểm tra hết hạn
        if (detailsRes.data.details && detailsRes.data.details.length > 0) {
          // Giả sử API trả về bookingDate trong details (nếu không, cần API riêng)
          const bookingDateStr = detailsRes.data.details[0].BookingDate;
          if (bookingDateStr) setBookingDate(bookingDateStr);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Không thể tải dữ liệu hóa đơn.";
        setPaymentError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [bookingId]);

  // Kiểm tra hết hạn thanh toán (quá 1 tiếng)
  useEffect(() => {
    if (!bookingDate) return;
    const created = new Date(bookingDate);
    const now = new Date();
    const diffMs = now - created;
    if (diffMs > 60 * 60 * 1000) {
      setIsExpired(true);
      // Nếu đã quá hạn thì xóa thông báo hủy thành công (nếu có)
      setPaymentError("");
    }
  }, [bookingDate]);

  const handlePayment = async () => {
    setPaymentError(""); // Xóa lỗi cũ trước khi thử lại
    try {
      const res = await axios.post(
        "http://localhost:3001/api/create-payment-url",
        {
          amount: bookingInfo.total,
          bookingId: bookingId,
        }
      );
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      // **ĐÂY LÀ PHẦN SỬA LỖI QUAN TRỌNG**
      // Lấy và hiển thị chính xác thông báo lỗi từ server
      const errorMessage =
        err.response?.data?.message || "Không thể tạo link thanh toán VNPay.";
      setPaymentError(errorMessage);
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/booking/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentError("Đơn hàng đã được hủy thành công.");
      setBookingInfo((prev) => ({ ...prev, isPaid: false }));
      setIsExpired(true);
    } catch (err) {
      setPaymentError(
        err.response?.data?.message || "Không thể hủy đơn hàng."
      );
    }
  };

  if (loading) {
    return (
      <div className="testing-history-container">
        <h2>Đang tải dữ liệu...</h2>
      </div>
    );
  }

  return (
    <div className="testing-history-container">
      <h2>Chi tiết hóa đơn #{bookingId}</h2>

      {/* Hiển thị lỗi (nếu có) */}
      {paymentError && (
        <div className="payment-message error">{paymentError}</div>
      )}

      <table className="details-table">
        <thead>
          <tr>
            <th>Dịch vụ</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, idx) => (
            <tr key={idx}>
              <td>{item.Service_name}</td>
              <td className="text-right">
                {Number(item.Price).toLocaleString()} đ
              </td>
              <td className="text-center">{item.Quantity}</td>
              <td className="text-right">
                {(Number(item.Price) * Number(item.Quantity)).toLocaleString()}{" "}
                đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-amount">
        Tổng tiền:{" "}
        <span className="total-price">
          {bookingInfo.total.toLocaleString()} đ
        </span>
      </div>

      {/* Dựa vào trạng thái isPaid để hiển thị nút hoặc thông báo */}
      {isExpired ? (
        <div className="payment-message error">
          <p>Đơn hàng này đã bị hủy do quá hạn thanh toán.</p>
        </div>
      ) : paymentError === "Đơn hàng đã được hủy thành công." ? (
        <div className="payment-message error">
          <p>Đơn hàng này đã được hủy thành công.</p>
        </div>
      ) : bookingInfo.isPaid ? (
        <div className="payment-message success">
          <p>Đơn hàng này đã được thanh toán thành công!</p>
        </div>
      ) : (
        <div className="payment-actions">
          <button
            onClick={handlePayment}
            className="payment-button"
            disabled={bookingInfo.total <= 0 || paymentError}
          >
            Thanh toán
          </button>
          <button
            onClick={handleCancel}
            className="payment-button"
            style={{ background: '#e74c3c', marginLeft: 12 }}
            disabled={paymentError}
          >
            Hủy đơn hàng
          </button>
        </div>
      )}
    </div>
  );
};

export default TestingHistory;
