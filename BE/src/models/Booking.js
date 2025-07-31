const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import để thiết lập quan hệ
const Information = require("./Information");

const Booking = sequelize.define("Booking", {
  Booking_ID: { type: DataTypes.BIGINT, primaryKey: true },
  BookingDate: DataTypes.DATEONLY,
  Booking_Status: {
    type: DataTypes.ENUM(
      'Chờ xác nhận', 'Đã xác nhận', 'Đang gửi kit', 'Đã gửi kit', 'Nhân viên đang đến', 'Nhân viên đã đến', 'Đã thu mẫu', 'Đang xét nghiệm', 'Hoàn tất', 'Đã hủy'
    ),
    defaultValue: 'Chờ xác nhận'
  },
  AppointmentTime: DataTypes.TIME,
  AppointmentDate: DataTypes.DATEONLY,
  ReceiveDate: DataTypes.DATEONLY,
  ReceiveResult: DataTypes.ENUM('Tại cơ sở', 'Gửi về địa chỉ'),
  Shipping_Status: DataTypes.ENUM('Không có', 'Đang vận chuyển kết quả', 'Đã gửi kết quả', 'Không gửi được kết quả'),
  InformationID: { type: DataTypes.BIGINT, allowNull: false },
  PM_ID: { type: DataTypes.BIGINT, allowNull: true },
  Staff_ID: { type: DataTypes.BIGINT, allowNull: true },
  ChekinImage: { type: DataTypes.STRING(255), allowNull: true },
  Checkin_Status: {
    type: DataTypes.ENUM('Chưa đến', 'Đã đến', 'Không đến'),
    defaultValue: 'Chưa đến'
  }
}, {
  tableName: "Booking",
  timestamps: false
});

// === Thiết lập mối quan hệ ===
Booking.belongsTo(Information, {
  foreignKey: "InformationID",
  targetKey: "Information_ID",
});

module.exports = Booking;
