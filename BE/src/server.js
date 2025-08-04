require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const path = require("path");

// Import các routes
const bookingRoute = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const managerRoutes = require("./routes/managerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const staffBookingRoutes = require("./routes/staffBookingRoutes"); // Đổi tên biến để tránh trùng lặp
const kitnsample = require("./routes/staffKitNSampleRoutes");
const vnpayRoutes = require("./routes/vnpayRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const cateRoutes = require("./routes/cateRoutes");

// 🔌 IMPORT SOCKET SERVER
const http = require("http");
const socketServer = require("./socketServer");

const app = express();
const server = http.createServer(app);

// Khai báo middleware cơ bản
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// =================================================================
// SỬA LỖI TẠI ĐÂY: Cấu hình phục vụ file tĩnh
// Đặt ngay sau các middleware cơ bản và TRƯỚC các API routes
// Dòng này báo cho Express: "Khi có yêu cầu đến '/results', hãy tìm file trong thư mục 'BE/src/public/results'"
app.use(express.static(path.join(__dirname, "public")));
// =================================================================

//Map
const routeMap = require("./routes/routeMap");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/booking", bookingRoute);
app.use("/api/manager", managerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffBookingRoutes); // Sử dụng biến đã đổi tên
app.use("/api/staff", kitnsample);
app.use("/api/route", routeMap);
app.use("/api", vnpayRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/category", cateRoutes);

// Khởi động socket server
socketServer(server);

// Kết nối DB và khởi động cả server + socket
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối database thành công");
    server.listen(3001, () => {
      console.log("🚀 Server + Socket.IO chạy tại http://localhost:3001");
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối:", err);
  });
