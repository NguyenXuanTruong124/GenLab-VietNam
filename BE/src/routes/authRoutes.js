const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);

router.post("/register", authController.register);
router.post("/verify-register-otp", authController.verifyRegisterOtp);
router.post("/send-reset-otp", authController.sendResetOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
