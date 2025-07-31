const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const {
  authenticateJWT,
  authorizeRoles,
  allowManagerOrAdmin,
} = require("../middleware/authMiddleware");
// Tạo booking mới
router.post("/create", authenticateJWT, bookingController.createBooking);

// Lấy danh sách booking hoặc chi tiết 1 booking
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);

// Cập nhật toàn bộ đơn (địa chỉ, giờ, v.v.)
router.put("/:id", bookingController.updateBooking);

// Lấy chi tiết dịch vụ của 1 booking (Booking_details + Service)
router.get("/:id/details", bookingController.getBookingDetailsWithService);
// Lấy danh sách tất cả booking của user theo email
// router.get("/user/:email", bookingController.getBookingByUserEmail);
// Lấy tổng tiền booking (dùng calculateBookingTotal)
router.get("/:id/total", bookingController.getBookingTotal);
// Cập nhật trạng thái booking (đã thanh toán, đã hủy, v.v.)
router.get("/:id/status-total", bookingController.getBookingStatusAndTotal);
router.get("/user/:email", bookingController.getBookingsByUserEmail);
// Hủy đơn hàng
router.put("/:id/cancel", authenticateJWT, bookingController.cancelBooking);
module.exports = router;
