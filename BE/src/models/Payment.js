const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    PM_ID: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true, // Thêm thuộc tính này
    },
    Transaction_no: {
      type: DataTypes.INTEGER,
      allowNull: true, // Cho phép null vì có thể có các phương thức thanh toán khác
    },
    PM_Refund: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "Payment",
    timestamps: false,
  }
);

module.exports = Payment;