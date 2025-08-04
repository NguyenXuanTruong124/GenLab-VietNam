const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

const {
  authenticateJWT,
  authorizeRoles,
  allowManagerOrAdmin,
} = require("../middleware/authMiddleware");

// Route quản lý account
router.get(
  "/account/",
  authenticateJWT,
  authorizeRoles("Admin"),
  accountController.getAllAccounts
);
router.post(
  "/account/",
  authenticateJWT,
  authorizeRoles("Admin"),
  accountController.createAccount
);
router.put(
  "/account/:id",
  authenticateJWT,
  authorizeRoles("Admin"),
  accountController.updateAccount
);
router.put(
  "/account/:id/status",
  authenticateJWT,
  authorizeRoles("Admin"),
  accountController.deleteAccountStatus
);
// Route quản lý dịch vụ
const {
  addService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.get(
  "/account/service/",
  authenticateJWT,
  allowManagerOrAdmin,
  getAllServices
);
router.get(
  "/account/service/:id",
  authenticateJWT,
  allowManagerOrAdmin,
  getServiceById
);
router.post(
  "/account/service/",
  authenticateJWT,
  allowManagerOrAdmin,
  addService
);
router.put(
  "/account/service/:id",
  authenticateJWT,
  allowManagerOrAdmin,
  updateService
);
router.delete(
  "/account/service/:id",
  authenticateJWT,
  allowManagerOrAdmin,
  deleteService
);
module.exports = router;
