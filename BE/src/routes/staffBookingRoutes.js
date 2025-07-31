const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const controller = require("../controllers/staffBookingController.js");
const staffController = require("../controllers/staffController");

// Lấy tất cả bookings
router.get(
  "/booking",
  authenticateJWT,
  // Updated roles to include Manager as seen in the JSX file
  authorizeRoles("Staff", "Manager"),
  controller.getAllBookingsWithInfo
);

// Cập nhật booking theo Booking_ID
router.put(
  "/booking/:id",
  authenticateJWT,
  authorizeRoles("Staff", "Manager"),
  controller.updateBooking
);

// NEW: Upload Test Result PDF
router.post(
  "/booking/:id/upload-result",
  authenticateJWT,
  authorizeRoles("Staff", "Manager"),
  controller.uploadMiddleware, // Multer middleware handles the file upload first
  controller.uploadTestResult // Controller handles DB updates
);

// NEW: Upload Checkin Image
router.post(
  "/booking/:id/upload-checkin",
  authenticateJWT,
  authorizeRoles("Staff", "Manager"),
  controller.uploadCheckinImageMiddleware,
  controller.uploadCheckinImage
);

router.get("/list", staffController.getAllStaffSimple);

module.exports = router;
