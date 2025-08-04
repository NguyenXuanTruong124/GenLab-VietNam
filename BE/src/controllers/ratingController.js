const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const Booking_details = require("../models/Booking_details");
const Service = require("../models/Service");

// 1. Lấy tất cả Booking_details (và Service) cho 1 Booking_ID để đánh giá
exports.getBookingDetailsForRating = async (req, res) => {
  const bookingId = req.params.bookingId;
  if (!bookingId) {
    return res.status(400).json({ message: "Thiếu mã đơn hàng (Booking_ID)" });
  }
  try {
    // Lấy tất cả Booking_details + Service cho booking này
    const details = await db.query(
      `SELECT bd.BD_ID, c.Cate_Name, bd.Comment, bd.Rate, bd.IsCommented, s.Service_name, s.Description
   FROM Booking_details bd
   JOIN Service s ON bd.Service_ID = s.Service_ID
   JOIN Category c ON bd.Category_ID = c.Category_ID
   WHERE bd.Booking_ID = ?`,
      {
        replacements: [bookingId],
        type: QueryTypes.SELECT,
      }
    );
    res.json({ details });
  } catch (err) {
    console.error("Lỗi lấy chi tiết để đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 2. Gửi đánh giá cho 1 Booking_details (BD_ID)
exports.submitRating = async (req, res) => {
  const { bdId } = req.params;
  const { rate, comment } = req.body;
  if (!bdId || rate === undefined) {
    return res.status(400).json({ message: "Thiếu BD_ID hoặc rate" });
  }
  try {
    // Cập nhật đánh giá và comment
    const [affectedRows] = await db.query(
      `UPDATE Booking_details SET Rate = ?, Comment = ?, IsCommented = TRUE WHERE BD_ID = ?`,
      {
        replacements: [rate, comment || null, bdId],
        type: QueryTypes.UPDATE,
      }
    );
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy Booking_details để cập nhật" });
    }
    res.json({ message: "Đánh giá thành công" });
  } catch (err) {
    console.error("Lỗi khi gửi đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
