const express = require("express");
const router = express.Router();
const vnpayController = require("../controllers/vnpayController");

router.post("/create-payment-url", vnpayController.createPaymentUrl);
router.get("/vnpay-return", vnpayController.vnpayReturn);

module.exports = router;
