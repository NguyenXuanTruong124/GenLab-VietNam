import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../skin_web/paymentPage.css"; // Giả sử bạn có file CSS này

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy bookingId từ state của navigate
  const bookingId = location.state?.bookingId;

  const [amount, setAmount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setError("Không tìm thấy mã đơn hàng. Vui lòng quay lại.");
      setLoading(false);
      return;
    }

    const fetchBookingStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/booking/${bookingId}/status-total`
        );
        setAmount(res.data.total);
        setIsPaid(res.data.isPaid);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Không thể lấy thông tin đơn hàng.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatus();
  }, [bookingId]);

  const handleVNPay = async () => {
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/create-payment-url",
        {
          amount: amount,
          bookingId: bookingId,
        }
      );
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Không thể tạo link thanh toán VNPay.";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">Đang tải thông tin thanh toán...</div>
    );
  }

  return (
    <div className="payment-container">
      <h2>Thanh toán đơn hàng #{bookingId}</h2>

      {error && <div className="payment-error">{error}</div>}

      {isPaid ? (
        <div className="payment-success">
          <p>Đơn hàng này đã được thanh toán thành công!</p>
          <button className="back-button" onClick={() => navigate("/lich-su")}>
            Quay về Lịch sử đơn hàng
          </button>
        </div>
      ) : (
        <>
          <div className="payment-info">
            <p>Số tiền cần thanh toán:</p>
            <div className="payment-amount">{amount.toLocaleString()} đ</div>
          </div>
          <button
            className="vnpay-btn"
            onClick={handleVNPay}
            disabled={amount <= 0}
          >
            Thanh toán qua VNPay
          </button>
        </>
      )}
    </div>
  );
}
