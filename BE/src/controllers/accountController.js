const Account = require("../models/Account");
const Information = require("../models/Information");
const { Op } = require("sequelize");

// Định nghĩa mối quan hệ giữa các model
// Đảm bảo rằng mối quan hệ này chỉ được định nghĩa một lần trong toàn bộ ứng dụng của bạn.
if (!Account.associations.INFORMATION) {
  Account.hasOne(Information, {
    foreignKey: "Account_ID",
    as: "INFORMATION",
    onDelete: "CASCADE",
  });
  Information.belongsTo(Account, { foreignKey: "Account_ID" });
}

// Lấy tất cả tài khoản
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      include: [{ model: Information, as: "INFORMATION" }],
      order: [["Account_ID", "DESC"]],
    });
    res.json(accounts);
  } catch (err) {
    console.error("ERROR in getAllAccounts:", err);
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách tài khoản", error: err.message });
  }
};

// Tạo tài khoản mới
exports.createAccount = async (req, res) => {
  const {
    username,
    password,
    email,
    role = "Customer",
    status = "ON",
    name,
    gender,
    dob,
    address,
    phone,
    cccd,
  } = req.body;

  const dobDate = new Date(dob);
  const now = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);

  if (dobDate > now || dobDate < hundredYearsAgo) {
    return res.status(400).json({
      message: "Ngày sinh không hợp lệ. Vui lòng chọn trong khoảng 100 năm trở lại.",
    });
  }

  // Kiểm tra các trường bắt buộc
  if (!username || !password || !email || !name || !dob) {
    return res.status(400).json({
      message:
        "Vui lòng điền đầy đủ các trường bắt buộc: Username, Password, Email, Họ tên, Ngày sinh.",
    });
  }

  try {
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existing = await Account.findOne({
      where: { [Op.or]: [{ Email: email }, { UserName: username }] },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email hoặc Username đã tồn tại!" });
    }

    // 1. Tạo record trong bảng ACCOUNT
    // Sequelize sẽ tự động bỏ qua việc chèn ID, và DB sẽ tự động tạo nó.
    const newAccount = await Account.create({
      UserName: username,
      Password: password, // Chú ý: Mật khẩu nên được mã hóa trước khi lưu
      Email: email,
      Role: role,
      Status: status,
    });

    // 2. Dùng ID vừa được tạo để tạo record trong bảng INFORMATION
    // newAccount chứa record vừa được tạo, bao gồm cả Account_ID tự tăng
    await Information.create({
      Account_ID: newAccount.Account_ID, // Lấy ID từ record vừa tạo
      Name_Information: name,
      Gender: gender,
      Date_Of_Birth: dob,
      Address: address,
      Phone: phone,
      CCCD: cccd,
    });

    res.status(201).json({ message: "Tạo tài khoản thành công!" });
  } catch (err) {
    console.error("Lỗi tạo tài khoản:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo tài khoản", error: err.message });
  }
};

// Cập nhật tài khoản
exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, name, gender, dob, address, phone, cccd } =
    req.body;

  try {
    // Cập nhật bảng Account
    await Account.update(
      { UserName: username, Email: email, Role: role },
      { where: { Account_ID: id } }
    );
    // Cập nhật bảng Information
    await Information.update(
      {
        Name_Information: name,
        Gender: gender,
        Date_Of_Birth: dob,
        Address: address,
        Phone: phone,
        CCCD: cccd,
      },
      { where: { Account_ID: id } }
    );
    res.json({ message: "Cập nhật thông tin thành công!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật thông tin", error: err.message });
  }
};

// Cập nhật trạng thái (Khóa/Mở khóa)
exports.deleteAccountStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ON", "OFF"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ." });
  }
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "ID tài khoản không hợp lệ." });
  }

  try {
    await Account.update({ Status: status }, { where: { Account_ID: id } });
    res.json({ message: `Cập nhật trạng thái thành công!` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật trạng thái", error: err.message });
  }
};
