const { DataTypes } = require("sequelize");
// **QUAN TRỌNG**: Hãy đảm bảo đường dẫn này trỏ đúng đến file cấu hình sequelize của bạn
const sequelize = require("../config/database");

const Account = sequelize.define(
  "Account",
  {
    // Đây là phần sửa lỗi quan trọng nhất
    Account_ID: {
      type: DataTypes.BIGINT,
      autoIncrement: true, // Báo cho Sequelize biết đây là cột tự động tăng
      primaryKey: true,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Role: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("ON", "OFF"),
      defaultValue: "ON",
      allowNull: false,
    },
  },
  {
    tableName: "ACCOUNT", // Tên bảng trong database
    timestamps: false, // Không tự động thêm các cột createdAt và updatedAt
  }
);

module.exports = Account;
