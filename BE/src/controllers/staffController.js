const Account = require("../models/Account");
const Information = require("../models/Information");
const { Op } = require("sequelize");

// GHI CHÚ: Mối quan hệ đã được định nghĩa ở file accountController.js
// nên chúng ta không cần định nghĩa lại ở đây để tránh lỗi.

// Lấy danh sách tất cả nhân viên
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Account.findAll({
      where: { Role: "Staff" },
      include: [{ model: Information, as: "INFORMATION" }],
      order: [["Account_ID", "DESC"]],
    });
    res.json(staffList);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách nhân viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách nhân viên", error: err.message });
  }
};

// Lấy thông tin của một nhân viên theo ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Account.findOne({
      where: { Account_ID: req.params.id, Role: "Staff" },
      include: [{ model: Information, as: "INFORMATION" }],
    });
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json(staff);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin nhân viên", error: err.message });
  }
};

// Lấy danh sách tất cả nhân viên (chỉ Account_ID, Name_Information, chỉ ON)
exports.getAllStaffSimple = async (req, res) => {
  try {
    const staffList = await Account.findAll({
      where: { Role: "Staff", Status: "ON" },
      include: [{ model: Information, as: "INFORMATION", attributes: ["Name_Information"] }],
      attributes: ["Account_ID"],
      order: [["Account_ID", "DESC"]],
    });
    // Đưa về dạng [{Account_ID, Name_Information}]
    const result = staffList.map(staff => ({
      Account_ID: staff.Account_ID,
      Name_Information: staff.INFORMATION?.Name_Information || ""
    }));
    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách nhân viên:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error: err.message });
  }
};

// Tạo nhân viên mới
exports.createStaff = async (req, res) => {
  const { username, password, email, name, gender, dob, address, phone, cccd } =
    req.body;

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

    // 1. Tạo record trong bảng ACCOUNT với Role là 'Staff'
    const newStaffAccount = await Account.create({
      UserName: username,
      Password: password, // Chú ý: Mật khẩu nên được mã hóa
      Email: email,
      Role: "Staff", // Gán vai trò là nhân viên
      Status: "ON",
    });

    // 2. Dùng ID vừa được tạo để tạo record trong bảng INFORMATION
    await Information.create({
      Account_ID: newStaffAccount.Account_ID, // Lấy ID từ record vừa tạo
      Name_Information: name,
      Gender: gender,
      Date_Of_Birth: dob,
      Address: address,
      Phone: phone,
      CCCD: cccd,
    });

    res.status(201).json({ message: "Thêm nhân viên thành công!" });
  } catch (error) {
    console.error("Lỗi tạo staff:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo nhân viên!", error: error.message });
  }
};

// Cập nhật thông tin nhân viên
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, name, gender, dob, address, phone, cccd } =
    req.body;

  try {
    const accountData = { UserName: username, Email: email };
    // Chỉ cập nhật mật khẩu nếu có giá trị mới được gửi lên
    if (password) {
      accountData.Password = password; // Nên mã hóa mật khẩu mới
    }
    await Account.update(accountData, { where: { Account_ID: id } });

    const informationData = {
      Name_Information: name,
      Gender: gender,
      Date_Of_Birth: dob,
      Address: address,
      Phone: phone,
      CCCD: cccd,
    };
    await Information.update(informationData, { where: { Account_ID: id } });

    res.json({ message: "Cập nhật thông tin nhân viên thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật nhân viên", error: error.message });
  }
};

// Vô hiệu hóa/Kích hoạt tài khoản nhân viên (thay đổi trạng thái)
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Account.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên." });
    }
    // Đảo ngược trạng thái hiện tại
    const newStatus = staff.Status === "ON" ? "OFF" : "ON";
    await staff.update({ Status: newStatus });
    res.json({
      message: `Đã cập nhật trạng thái nhân viên thành ${newStatus}.`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái nhân viên",
      error: err.message,
    });
  }
};
