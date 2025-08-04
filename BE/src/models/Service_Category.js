const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service_Category = sequelize.define("Service_Category", {
  Category_ID: { type: DataTypes.STRING(20), primaryKey: true },
  Service_ID: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  tableName: "Service_Category",
  timestamps: false
});

module.exports = Service_Category;