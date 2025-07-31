const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateJWT } = require("../middleware/authMiddleware");

// Dùng /:id để nhất quán với các routes khác
// Bất kỳ người dùng nào đã đăng nhập đều có thể xem và sửa profile của mình
router.get("/:Account_ID", authenticateJWT, profileController.getProfile);
router.put("/:Account_ID", authenticateJWT, profileController.updateProfile);

module.exports = router;
