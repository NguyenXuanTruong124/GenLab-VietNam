const express = require("express");
const router = express.Router();
const staffSampleController = require("../controllers/staffKitNSampleController");
const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");

// GET tất cả kit & sample
router.get("/kitnsample", authenticateJWT,
  authorizeRoles("Staff"), staffSampleController.getAllKits);

// POST tạo mới kit và sample rỗng
router.post("/kitnsample", authenticateJWT,
  authorizeRoles("Staff"), staffSampleController.createKit);

// PUT cập nhật kit và sample
router.put("/kitnsample/:id", authenticateJWT,
  authorizeRoles("Staff"), staffSampleController.updateKit);

router.get("/available-bookings", authenticateJWT,
  authorizeRoles("Staff"), staffSampleController.getBookingWithStatus);

module.exports = router;
