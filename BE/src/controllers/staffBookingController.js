const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- MULTER CONFIGURATION ---
const uploadDir = path.join(__dirname, "../public/results");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const bookingId = req.params.id;
    const filename = `result_${bookingId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép tải lên file PDF!"), false);
    }
  },
}).single("resultPdf");

exports.uploadMiddleware = upload;

// --- UPLOAD CHECKIN IMAGE ---
const checkinDir = path.join(__dirname, "../public/checkin");
if (!fs.existsSync(checkinDir)) {
  fs.mkdirSync(checkinDir, { recursive: true });
}

const checkinStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, checkinDir);
  },
  filename: (req, file, cb) => {
    const bookingId = req.params.id;
    const ext = path.extname(file.originalname);
    const filename = `checkin_${bookingId}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const checkinUpload = multer({
  storage: checkinStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép tải lên file ảnh!"), false);
    }
  },
}).single("checkinImage");

exports.uploadCheckinImageMiddleware = checkinUpload;

// --- GET ALL BOOKINGS WITH STAFF_ID ---
exports.getAllBookingsWithInfo = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.Booking_ID, b.BookingDate, b.Booking_Status, b.AppointmentDate, b.AppointmentTime,
        b.ReceiveDate, b.ReceiveResult, b.Shipping_Status, b.Checkin_Status, b.ChekinImage, -- thêm trường này
        i.Name_Information AS CustomerName,
        acc.Email, acc.UserName, tr.Result_PDF_URL, tr.Result AS TestResult,
        ks.Account_ID AS Staff_ID,
        info_staff.Name_Information AS Staff_Name,
        (
          SELECT GROUP_CONCAT(CONCAT(s.Service_name, ' (', c.Cate_name, ')') SEPARATOR ', ')
          FROM Booking_Details bd
          JOIN Service s ON bd.Service_ID = s.Service_ID
          JOIN Category c ON bd.Category_ID = c.Category_ID
          WHERE bd.Booking_ID = b.Booking_ID
        ) AS Service_Names,
        (
          SELECT GROUP_CONCAT(c.Cate_name SEPARATOR ', ')
          FROM Booking_Details bd
          JOIN Category c ON bd.Category_ID = c.Category_ID
          WHERE bd.Booking_ID = b.Booking_ID
        ) AS Cate_Names
      FROM Booking b
      JOIN Information i ON b.InformationID = i.Information_ID
      JOIN ACCOUNT acc ON i.Account_ID = acc.Account_ID
      LEFT JOIN Test_Result tr ON b.Booking_ID = tr.Booking_ID
      LEFT JOIN Booking_Details bd ON b.Booking_ID = bd.Booking_ID
      LEFT JOIN Kit_Sample ks ON bd.BD_ID = ks.BD_ID
      LEFT JOIN Account acc_staff ON ks.Account_ID = acc_staff.Account_ID
      LEFT JOIN Information info_staff ON acc_staff.Account_ID = info_staff.Account_ID
      ORDER BY b.BookingDate DESC
    `;
    const results = await db.query(query, { type: QueryTypes.SELECT });
    return res.json(results);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu booking:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// --- UPDATE BOOKING ---
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    Booking_Status,
    AppointmentDate,
    AppointmentTime,
    ReceiveDate,
    ReceiveResult,
    Staff_ID,
    Shipping_Status, // nhận thêm trường này
    Checkin_Status, // nhận thêm trường này
  } = req.body;

  try {
    // Lấy trạng thái hiện tại và toàn bộ thông tin booking
    const [booking] = await db.query(
      `SELECT * FROM Booking WHERE Booking_ID = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    if (booking.Booking_Status === 'Đã hủy') {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy, không thể cập nhật." });
    }
    // Nếu cập nhật Checkin_Status thành 'Không đến', tự động chuyển trạng thái Booking_Status thành 'Đã hủy'
    let newBookingStatus = Booking_Status !== undefined ? Booking_Status : booking.Booking_Status;
    if (Checkin_Status === 'Không đến') {
      newBookingStatus = 'Đã hủy';
    }
    // Hàm chuẩn hóa giá trị ngày
    function normalizeDate(val, oldVal) {
      if (val === undefined) return oldVal;
      if (val === '') return null;
      return val;
    }
    const newAppointmentDate = normalizeDate(AppointmentDate, booking.AppointmentDate);
    const newAppointmentTime = normalizeDate(AppointmentTime, booking.AppointmentTime);
    const newReceiveDate = normalizeDate(ReceiveDate, booking.ReceiveDate);
    const newReceiveResult = ReceiveResult !== undefined ? ReceiveResult : booking.ReceiveResult;
    const newShippingStatus = Shipping_Status !== undefined ? Shipping_Status : booking.Shipping_Status;
    const newCheckinStatus = Checkin_Status !== undefined ? Checkin_Status : booking.Checkin_Status;
    await db.query(
      `
      UPDATE Booking 
      SET Booking_Status = ?, AppointmentDate = ?, AppointmentTime = ?, ReceiveDate = ?, ReceiveResult = ?, Shipping_Status = ?, Checkin_Status = ?
      WHERE Booking_ID = ?
      `,
      {
        replacements: [
          newBookingStatus,
          newAppointmentDate,
          newAppointmentTime,
          newReceiveDate,
          newReceiveResult,
          newShippingStatus,
          newCheckinStatus,
          id,
        ],
        type: QueryTypes.UPDATE,
      }
    );
    // Nếu là Manager và có Staff_ID, cập nhật lại Account_ID của Kit_Sample
    if (req.user && req.user.role === "Manager" && Staff_ID) {
      await db.query(
        `UPDATE Kit_Sample ks
         JOIN Booking_details bd ON ks.BD_ID = bd.BD_ID
         SET ks.Account_ID = ?
         WHERE bd.Booking_ID = ?`,
        {
          replacements: [Staff_ID, id],
          type: QueryTypes.UPDATE,
        }
      );
    }
    res.json({ message: "Cập nhật booking thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật booking:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// --- UPLOAD RESULT PDF ---
exports.uploadTestResult = async (req, res) => {
  const bookingId = req.params.id;
  const { testResult } = req.body; // Thêm tham số testResult

  if (!req.file) {
    return res.status(400).json({
      message: "Không có file được tải lên hoặc định dạng không đúng.",
    });
  }

  if (!testResult) {
    return res.status(400).json({
      message: "Vui lòng điền kết quả quan hệ huyết thống.",
    });
  }

  const pdfUrl = `/results/${req.file.filename}`;
  const testDate = new Date().toISOString().slice(0, 10);

  try {
    const existingResult = await db.query(
      `SELECT * FROM Test_Result WHERE Booking_ID = ?`,
      { replacements: [bookingId], type: QueryTypes.SELECT }
    );

    if (existingResult.length > 0) {
      await db.query(
        `UPDATE Test_Result SET Result = ?, Result_PDF_URL = ?, Test_Date = ? WHERE Booking_ID = ?`,
        {
          replacements: [testResult, pdfUrl, testDate, bookingId],
          type: QueryTypes.UPDATE,
        }
      );
    } else {
      await db.query(
        `INSERT INTO Test_Result (Test_Date, Result, Result_PDF_URL, Booking_ID) VALUES (?, ?, ?, ?)`,
        {
          replacements: [testDate, testResult, pdfUrl, bookingId],
          type: QueryTypes.INSERT,
        }
      );
    }

    // Lấy trạng thái check-in hiện tại trước khi cập nhật
    const [currentBooking] = await db.query(
      `SELECT Checkin_Status FROM Booking WHERE Booking_ID = ?`,
      { replacements: [bookingId], type: QueryTypes.SELECT }
    );
    
    await db.query(
      `UPDATE Booking SET Booking_Status = 'Hoàn tất', Checkin_Status = ? WHERE Booking_ID = ?`,
      { replacements: [currentBooking?.Checkin_Status || 'Chưa đến', bookingId], type: QueryTypes.UPDATE }
    );

    res.json({
      message: "Tải lên kết quả và cập nhật trạng thái thành công.",
      pdfUrl: pdfUrl,
      testResult: testResult,
    });
  } catch (error) {
    console.error("===== DATABASE ERROR DETAILS =====");
    console.error(error);
    console.error("==================================");

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Lỗi khi xóa file sau khi DB fail:", unlinkErr);
      }
    }
    res.status(500).json({
      message: "Lỗi server khi cập nhật database",
      error: error.message,
    });
  }
};

exports.uploadCheckinImage = async (req, res) => {
  const bookingId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ message: "Không có file ảnh được tải lên hoặc định dạng không đúng." });
  }
  const imageUrl = `/checkin/${req.file.filename}`;
  try {
    await db.query(
      `UPDATE Booking SET ChekinImage = ? WHERE Booking_ID = ?`,
      { replacements: [imageUrl, bookingId], type: QueryTypes.UPDATE }
    );
    res.json({ message: "Tải lên ảnh check-in thành công!", imageUrl });
  } catch (err) {
    // Nếu lỗi, xóa file vừa upload
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ message: "Lỗi server khi cập nhật ảnh check-in", error: err.message });
  }
};
