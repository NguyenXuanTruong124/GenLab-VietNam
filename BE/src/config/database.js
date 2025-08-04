require("dotenv").config();
const mysql = require("mysql2");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("genlabvietnam", "root", "12345", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
