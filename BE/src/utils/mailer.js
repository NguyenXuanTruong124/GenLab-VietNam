const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ngxtruong010204@gmail.com",
    pass: "xgwx jfwg wels codl", // app password từ Gmail
  },
});

module.exports = transporter;
