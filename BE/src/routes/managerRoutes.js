const express = require("express");
const router = express.Router();
const {
    authenticateJWT,
    authorizeRoles,
    allowManagerOrAdmin,
} = require("../middleware/authMiddleware");
// const managerController = require("../controllers/serviceController ");
const controller = require("../controllers/staffBookingController.js");

// Chỉ cho phép staff, manager, admin truy cập
// router.get("/dashboard",  authenticateJWT, authorizeRoles("Staff", "Manager", "Admin"), managerController.dashboard);
// Routes quản lý dịch vụ
const {
    addService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

router.get("/service/", authenticateJWT, allowManagerOrAdmin, getAllServices);
router.get(
    "/service/:id",
    authenticateJWT,
    allowManagerOrAdmin,
    getServiceById
);
router.post("/service/", authenticateJWT, allowManagerOrAdmin, addService);
router.put("/service/:id", authenticateJWT, allowManagerOrAdmin, updateService);
router.delete(
    "/service/:id",
    authenticateJWT,
    allowManagerOrAdmin,
    deleteService
);

// Routes quản lý nhân viên
const staffcontroller = require("../controllers/staffController");
router.get(
    "/staff/",
    authenticateJWT,
    authorizeRoles("Manager"),
    staffcontroller.getAllStaff
);
router.get(
    "/staff/:id",
    authenticateJWT,
    authorizeRoles("Manager"),
    staffcontroller.getStaffById
);
router.post(
    "/staff/",
    authenticateJWT,
    authorizeRoles("Manager"),
    staffcontroller.createStaff
);
router.put(
    "/staff/:id",
    authenticateJWT,
    authorizeRoles("Manager"),
    staffcontroller.updateStaff
);
router.delete(
    "/staff/:id",
    authenticateJWT,
    authorizeRoles("Manager"),
    staffcontroller.deleteStaff
);

// Lấy tất cả bookings - Monitor booking
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

module.exports = router;
