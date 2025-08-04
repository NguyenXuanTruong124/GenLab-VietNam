const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Information = sequelize.define(
  "Information",
  {
    Information_ID: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Account_ID: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Name_Information: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Date_Of_Birth: {
      type: DataTypes.DATEONLY, // Chỉ lưu ngày (DATE)
      allowNull: false,         // Theo CSDL là NOT NULL
    },
    Gender: {
      type: DataTypes.ENUM("Nam", "Nữ"), // Chuẩn ENUM như trong CSDL
      allowNull: true, // Bạn có thể set false nếu muốn khắt khe
    },
    Address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING(20), // đúng với VARCHAR(20)
      allowNull: true,
    },
    CCCD: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "Information",
    timestamps: false,
  }
);

module.exports = Information;
