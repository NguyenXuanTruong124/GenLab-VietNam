const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");
const Account = require("../models/Account");
const Information = require("../models/Information");
const transporter = require("../utils/mailer");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Account.findOne({
      where: {
        [Op.or]: [{ UserName: username }, { Email: username }],
        Password: password,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user.Account_ID, // Đúng tên trường
        username: user.UserName,
        email: user.Email,
        role: user.Role,
      },
      process.env.JWT_SECRET || "your-secret",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user.Account_ID,
        username: user.UserName,
        email: user.Email,
        role: user.Role,
        status: user.Status,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi đăng nhập", error: err.message });
  }
};

const client = new OAuth2Client(
  "367898675068-fmj2mrtue07srrmg83hg0v48vg59aqpv.apps.googleusercontent.com"
);

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience:
        "367898675068-fmj2mrtue07srrmg83hg0v48vg59aqpv.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await Account.findOne({ where: { Email: email } });

    if (!user) {
      user = await Account.create({
        Account_ID: Date.now(),
        UserName: email.split("@")[0],
        Email: email,
        Password: "",
        Role: "Customer",
        Status: "ON",
      });
    }

    const token = jwt.sign(
      {
        id: user.Account_ID,
        username: user.UserName,
        role: user.Role,
      },
      process.env.JWT_SECRET || "your-secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user: {
        id: user.Account_ID,
        username: user.UserName,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error("Lỗi Google Login:", error);
    res.status(401).json({ message: "Không thể xác thực tài khoản Google." });
  }
};

// Lưu OTP và thông tin đăng ký tạm thời
const otpStore = new Map(); // email => otp
const pendingRegisterStore = new Map(); // email => userData

const generateId = () => {
  return Date.now();
};

// Bước 1: Nhận thông tin đăng ký, gửi OTP về email, lưu tạm thông tin
const register = async (req, res) => {
  const {
    username,
    password,
    email,
    role = "Customer",
    name,
    gender,
    dob,
    address,
    phone,
    cccd,
  } = req.body;

  try {
    const existing = await Account.findOne({ where: { Email: email } });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại!" });

    // Sinh OTP và lưu tạm thông tin đăng ký
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    pendingRegisterStore.set(email, {
      username,
      password,
      email,
      role,
      name,
      gender,
      dob,
      address,
      phone,
      cccd,
    });

    await transporter.sendMail({
      from: "GENLAB Vietnam <ngxtruong010204@gmail.com>",
      to: email,
      subject: "Mã xác thực đăng ký tài khoản GENLAB",
      text: `Chào ${name},\n\nMã xác thực đăng ký tài khoản của bạn là: ${otp}\n\nVui lòng nhập mã này để hoàn tất đăng ký.\n\nNếu bạn không thực hiện đăng ký, hãy bỏ qua email này.`,
    });

    res.json({ message: "Đã gửi mã xác thực OTP về email. Vui lòng kiểm tra hộp thư." });
  } catch (error) {
    console.error("Lỗi gửi OTP đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi gửi OTP!" });
  }
};

// Bước 2: Xác thực OTP, nếu đúng thì tạo tài khoản
const verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;
  const validOtp = otpStore.get(email);
  const userData = pendingRegisterStore.get(email);

  if (!validOtp || otp !== validOtp) {
    return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn." });
  }
  if (!userData) {
    return res.status(400).json({ message: "Không tìm thấy thông tin đăng ký tạm thời." });
  }

  try {
    const accountId = generateId();
    await Account.create({
      Account_ID: accountId,
      UserName: userData.username,
      Password: userData.password,
      Email: userData.email,
      Role: userData.role,
      Status: "ON",
    });
    await Information.create({
      Information_ID: accountId + 1,
      Name_Information: userData.name,
      Gender: userData.gender,
      Date_Of_Birth: userData.dob,
      Address: userData.address,
      Phone: userData.phone,
      CCCD: userData.cccd,
      Account_ID: accountId,
    });

    otpStore.delete(email);
    pendingRegisterStore.delete(email);

    await transporter.sendMail({
      from: "GENLAB Vietnam <ngxtruong010204@gmail.com>",
      to: email,
      subject: "Đăng ký thành công",
      text: `Chào ${userData.name},\n\nBạn đã đăng ký tài khoản thành công tại GENLAB.\n\nThông tin tài khoản:\nTên đăng nhập: ${userData.username}\nEmail: ${email}\n\nCảm ơn bạn!`,
    });

    res.json({ message: "Đăng ký thành công! Vui lòng kiểm tra email." });
  } catch (error) {
    console.error("Lỗi xác thực OTP đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xác thực OTP!" });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const validOtp = otpStore.get(email);

  if (!validOtp || otp !== validOtp) {
    return res
      .status(400)
      .json({ message: "OTP không hợp lệ hoặc đã hết hạn." });
  }

  await Account.update({ Password: newPassword }, { where: { Email: email } });

  otpStore.delete(email);

  res.json({ message: "Đặt lại mật khẩu thành công!" });
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Account.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    await transporter.sendMail({
      from: "GENLAB <ngxtruong010204@gmail.com>",
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
    });

    res.json({ message: "OTP đã được gửi tới email của bạn." });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    res.status(500).json({ message: "Không thể gửi OTP" });
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  googleLogin,
  resetPassword,
  sendResetOtp,
};
