const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");

// Lấy tất cả Booking_details (và Service) cho 1 Booking_ID để đánh giá
router.get("/:bookingId/details", ratingController.getBookingDetailsForRating);

// Gửi đánh giá cho 1 Booking_details (BD_ID)
router.post("/:bdId/rate", ratingController.submitRating);

module.exports = router;
