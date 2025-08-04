const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Kit_Sample = sequelize.define("Kit_Sample", {
  Kit_ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Sample_Method: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Send_Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Receive_Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Status: {
    type: DataTypes.ENUM("ON", "OFF"),
    defaultValue: "OFF"
  },
  Sample_Status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Sample_Owner: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  BD_ID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: "Booking_details",
      key: "BD_ID"
    }
  },
  Account_ID: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: "Account",
      key: "Account_ID"
    }
  }
}, {
  tableName: "Kit_Sample",
  timestamps: false
});

module.exports = Kit_Sample;
