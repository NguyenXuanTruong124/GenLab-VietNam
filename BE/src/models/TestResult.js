const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Test_Result = sequelize.define(
  "Test_Result",
  {
    Test_ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true, // Thêm autoIncrement cho rõ ràng
    },
    Test_Date: DataTypes.DATEONLY,
    Result: DataTypes.STRING(255),

    // Thêm cột còn thiếu
    Result_PDF_URL: {
      type: DataTypes.STRING(255),
      allowNull: true, // Cho phép giá trị là NULL
    },

    Booking_ID: DataTypes.BIGINT,
  },
  {
    tableName: "Test_Result",
    timestamps: false,
  }
);

module.exports = Test_Result;
