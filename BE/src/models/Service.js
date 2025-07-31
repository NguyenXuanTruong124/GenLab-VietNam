const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define(
  "Service",
  {
    Service_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Service_name: DataTypes.STRING(100),
    Description: DataTypes.STRING(255),
    Price: DataTypes.STRING(50),
    Status: { type: DataTypes.ENUM('ON', 'OFF'), defaultValue: 'ON' }
  },
  {
    tableName: "Service",
    timestamps: false,
  }
);

module.exports = Service;