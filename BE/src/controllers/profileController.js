const Account = require("../models/Account");
const Information = require("../models/Information");
// axios không còn được sử dụng nên đã được xóa

// Lấy thông tin hồ sơ của một tài khoản
exports.getProfile = async (req, res) => {
  try {
    // Lấy Account_ID từ URL, ví dụ: /api/profile/20250626140100001
    const { Account_ID } = req.params;

    // 1. Tìm tài khoản trong bảng ACCOUNT bằng khóa chính
    const account = await Account.findByPk(Account_ID);
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    // 2. Tìm thông tin chi tiết trong bảng INFORMATION dựa trên Account_ID
    const information = await Information.findOne({
      where: { Account_ID: account.Account_ID }, // Sử dụng khóa ngoại Account_ID
    });
    if (!information) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin hồ sơ!" });
    }

    // 3. Trả về cả thông tin tài khoản và thông tin chi tiết
    res.json({ account, information });
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin profile:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// Cập nhật thông tin hồ sơ
exports.updateProfile = async (req, res) => {
  try {
    // Lấy Account_ID từ URL
    const { Account_ID } = req.params;

    // Lấy các trường thông tin từ body của request
    // Các tên trường này phải khớp với tên cột trong bảng INFORMATION
    const { Name_Information, Gender, Date_Of_Birth, Address, Phone, CCCD } =
      req.body;

    // 1. Tìm bản ghi Information cần cập nhật
    const info = await Information.findOne({
      where: { Account_ID: Account_ID },
    });

    if (!info) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ để cập nhật!" });
    }

    // 2. Tạo đối tượng chứa dữ liệu cần cập nhật
    const updateData = {
      Name_Information,
      Gender,
      Date_Of_Birth,
      Address,
      Phone,
      CCCD,
    };

    // 3. Thực hiện cập nhật
    await info.update(updateData);

    res.json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật profile:", error);
    res.status(500).json({ message: "Lỗi cập nhật!", error: error.message });
  }
};
