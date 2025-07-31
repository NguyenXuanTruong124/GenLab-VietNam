const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const moment = require("moment");

const vnpay = new VNPay({
  tmnCode: "3L2W1TOZ", // Thay bằng TmnCode của bạn
  secureSecret: "IJN9MUI29NJLRWJHTKSG4PS2UBQ67E58", // Thay bằng Secure Secret của bạn
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
  hashAlgorithm: "SHA512",
  loggerFn: ignoreLogger,
});

exports.createPaymentUrl = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res
        .status(400)
        .json({ message: "Thiếu tổng tiền hoặc mã booking." });
    }

    // Kiểm tra xem đơn hàng đã được thanh toán chưa
    const [booking] = await db.query(
      `SELECT PM_ID FROM Booking WHERE Booking_ID = ?`,
      {
        replacements: [bookingId],
        type: QueryTypes.SELECT,
      }
    );

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (booking.PM_ID) {
      return res
        .status(409)
        .json({ message: "Đơn hàng này đã được thanh toán." });
    }

    const uniqueTxnRef = `${bookingId}_${Date.now()}`;
    const ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const now = new Date();
    const returnUrl = `http://localhost:3001/api/vnpay-return`;
    const expireDate = moment(now).add(15, "minutes").format("YYYYMMDDHHmmss");

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(amount),
      vnp_IpAddr: ipAddr === "::1" ? "127.0.0.1" : ipAddr,
      vnp_TxnRef: uniqueTxnRef,
      vnp_OrderInfo: `Thanh toan cho don hang ${bookingId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now, "yyyymmddHHMMss"),
      vnp_ExpireDate: expireDate,
    });

    return res.status(201).json({ paymentUrl });
  } catch (err) {
    console.error("❌ Lỗi khi tạo URL thanh toán VNPay:", err);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống khi tạo URL thanh toán" });
  }
};

exports.vnpayReturn = async (req, res) => {
  const query = req.query;
  const returnedTxnRef = query.vnp_TxnRef;
  const bookingId = returnedTxnRef.split("_")[0];
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  try {
    const isValid = vnpay.verifyReturnUrl(query, {
      secureSecret: "IJN9MUI29NJLRWJHTKSG4PS2UBQ67E58",
    });

    if (!isValid) {
      console.warn("==[VNPay] Chữ ký không hợp lệ.");
      return res.redirect(
        `${clientUrl}/lich-su/${bookingId}?payment=failed&message=invalid_signature`
      );
    }

    if (query.vnp_ResponseCode === "00") {
      const transactionNo = query.vnp_TransactionNo;
      const [paymentResult] = await db.query(
        `INSERT INTO Payment (Transaction_no) VALUES (?)`,
        { replacements: [transactionNo], type: QueryTypes.INSERT }
      );

      await db.query(
        `UPDATE Booking SET Booking_Status = 'Đã xác nhận', PM_ID = ? WHERE Booking_ID = ?`,
        { replacements: [paymentResult, bookingId], type: QueryTypes.UPDATE }
      );

      return res.redirect(`${clientUrl}/lich-su?payment=success`);
    } else {
      return res.redirect(
        `${clientUrl}/lich-su/${bookingId}?payment=failed&message=payment_failed`
      );
    }
  } catch (err) {
    console.error("==[VNPay] Lỗi xử lý vnpay_return:", err);
    return res.redirect(
      `${clientUrl}/lich-su/${bookingId}?payment=failed&message=server_error`
    );
  }
};
