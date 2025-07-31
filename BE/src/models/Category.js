const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  Category_ID: { type: DataTypes.STRING(20), primaryKey: true },
  Cate_name: DataTypes.STRING(200),
  Status: { type: DataTypes.ENUM("ON", "OFF"), defaultValue: "ON" }
}, {
  tableName: "Category",
  timestamps: false
});

module.exports = Category;