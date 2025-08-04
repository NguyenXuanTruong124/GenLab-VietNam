const db = require("../config/database");
const { QueryTypes } = require("sequelize");
const nodemailer = require("nodemailer");
const Booking = require("../models/Booking");

async function getNextStaff() {
  const [staff] = await db.query(
    `SELECT acc.Account_ID
     FROM ACCOUNT acc
     LEFT JOIN Staff_Assign_Log sal ON acc.Account_ID = sal.Staff_ID
     WHERE acc.Role = 'Staff' AND acc.Status = 'ON'
     ORDER BY sal.Last_Assigned IS NULL DESC, sal.Last_Assigned ASC, acc.Account_ID ASC
     LIMIT 1`,
    { type: QueryTypes.SELECT }
  );

  if (!staff) throw new Error("Không tìm thấy nhân viên phù hợp.");

  await db.query(
    `INSERT INTO Staff_Assign_Log (Staff_ID, Last_Assigned)
     VALUES (?, NOW())
     ON DUPLICATE KEY UPDATE Last_Assigned = NOW()`,
    {
      replacements: [staff.Account_ID],
      type: QueryTypes.INSERT,
    }
  );

  return staff.Account_ID;
}

//Create
exports.createBooking = async (req, res) => {
  const { id: accountId, email: userEmail, role } = req.user;
  // Chỉ cho phép Customer booking
  if (role !== 'Customer') {
    return res.status(403).json({ message: 'Chỉ khách hàng mới được phép đặt lịch.' });
  }
  const {
    email,
    name,
    phone,
    address,
    appointmentDate,
    appointmentHour,
    receiveDate,
    receiveResult,
    serviceName,
    service_ID,
    categoryId, // FE gửi lên
    note,
  } = req.body;

  try {
    if ((!serviceName && !service_ID) || !categoryId) {
      return res.status(400).json({
        message: "Thiếu serviceName/service_ID hoặc categoryId.",
      });
    }

    // === RÀNG BUỘC THỜI GIAN ĐẶT LỊCH ===
    if (appointmentDate) {
      const today = new Date();
      const selectedDate = new Date(appointmentDate);
      if (
        selectedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0] &&
        appointmentHour
      ) {
        const [h, m] = appointmentHour.split(":").map(Number);
        const nowHour = today.getHours();
        const nowMinute = today.getMinutes();
        const hourDiff = h - nowHour;
        if (hourDiff < 2 || (hourDiff === 2 && m <= nowMinute)) {
          return res.status(400).json({
            message: "Bạn chỉ được đặt lịch sau thời điểm hiện tại ít nhất 2 tiếng. Vui lòng chọn khung giờ khác!"
          });
        }
      }
    }

    // 🔍 Lấy Account_ID và Information_ID
    const [infoRow] = await db.query(
      `SELECT Information_ID FROM INFORMATION WHERE Account_ID = ?`,
      {
        replacements: [accountId],
        type: QueryTypes.SELECT,
      }
    );

    if (!infoRow) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ thông tin người dùng." });
    }

    const { Information_ID } = infoRow;

    // ✅ Cập nhật lại thông tin user
    await db.query(
      `UPDATE INFORMATION 
             SET Name_Information = ?, Phone = ?, Address = ?
             WHERE Information_ID = ?`,
      {
        replacements: [
          name || null,
          phone || null,
          address || null,
          Information_ID,
        ],
        type: QueryTypes.UPDATE,
      }
    );

    // 🔍 Lấy Service_ID và Service_name
    let serviceId = service_ID;
    let serviceNameFinal = serviceName;
    let price = null;
    if (serviceId) {
      // Nếu có service_ID, lấy serviceName và price từ DB
      const [serviceRow] = await db.query(
        `SELECT Service_ID, Service_name, Price FROM SERVICE WHERE Service_ID = ?`,
        {
          replacements: [serviceId],
          type: QueryTypes.SELECT,
        }
      );
      if (!serviceRow) {
        return res.status(400).json({ message: "service_ID không hợp lệ." });
      }
      serviceNameFinal = serviceRow.Service_name;
      price = parseInt(serviceRow.Price);
    } else {
      // Nếu không có service_ID, lấy như cũ từ serviceName
      const [serviceRow] = await db.query(
        `SELECT Service_ID, Service_name, Price FROM SERVICE WHERE Service_name = ?`,
        {
          replacements: [serviceName],
          type: QueryTypes.SELECT,
        }
      );
      if (!serviceRow) {
        return res.status(400).json({ message: "Tên dịch vụ không hợp lệ." });
      }
      // *** LOGIC MỚI: KIỂM TRA TRẠNG THÁI DỊCH VỤ ***
      if (serviceRow.Status === "OFF") {
        return res.status(400).json({
          message:
            "Dịch vụ này hiện không khả dụng. Vui lòng chọn dịch vụ khác.",
        });
      }
      serviceId = serviceRow.Service_ID;
      serviceNameFinal = serviceRow.Service_name;
      price = parseInt(serviceRow.Price);
    }

    // Kiểm tra categoryId có tồn tại và lấy Cate_name
    const [cateRow] = await db.query(
      `SELECT Category_ID, Cate_name FROM CATEGORY WHERE Category_ID = ?`,
      {
        replacements: [categoryId],
        type: QueryTypes.SELECT,
      }
    );
    if (!cateRow) {
      return res.status(400).json({ message: "Loại xét nghiệm không hợp lệ." });
    }

    // Kiểm tra đã có Booking_ID cho user này chưa (chỉ trạng thái Chờ xác nhận)
    let bookingId = null;
    const [existingBooking] = await db.query(
      `SELECT Booking_ID FROM BOOKING WHERE InformationID = ? AND Booking_Status = 'Chờ xác nhận' ORDER BY Booking_ID DESC LIMIT 1`,
      {
        replacements: [Information_ID],
        type: QueryTypes.SELECT,
      }
    );

    let bookingStatus = 'Chờ xác nhận';
    if (serviceId === 5 || serviceNameFinal === 'Tư vấn') {
      bookingStatus = 'Đã xác nhận';
    }

    if (existingBooking && existingBooking.Booking_ID) {
      bookingId = existingBooking.Booking_ID;
    } else {
      // Nếu chưa có, tạo mới Booking
      const today = new Date().toISOString().split("T")[0];
      const [bookingResult, bookingMeta] = await db.query(
        `INSERT INTO BOOKING 
                    (BookingDate, Booking_Status, AppointmentDate, AppointmentTime, ReceiveDate, ReceiveResult, InformationID)
                 VALUES 
                    (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            today,
            bookingStatus,
            appointmentDate || null,
            appointmentHour || null,
            receiveDate || null,
            receiveResult || null,
            Information_ID,
          ],
          type: QueryTypes.INSERT,
        }
      );
      bookingId =
        bookingMeta && bookingMeta.insertId
          ? bookingMeta.insertId
          : bookingResult;
    }

    // Insert vào Booking_details
    const [bdResult, bdMeta] = await db.query(
      `INSERT INTO Booking_details 
        (Quantity, Category_ID, Comment, Rate, Service_ID, Booking_ID)
     VALUES (?, ?, ?, NULL, ?, ?)`,
      {
        replacements: [1, categoryId, note || null, serviceId, bookingId],
        type: QueryTypes.INSERT,
      }
    );

    const BD_ID = bdMeta?.insertId || bdResult; // ID của booking_details vừa tạo

    // ✅ Lấy nhân viên luân phiên
    const assignedStaffID = await getNextStaff();

    // ✅ Tạo 2 bản ghi Kit_Sample với Account_ID là nhân viên
    const kitIds = [];
    for (let i = 0; i < 2; i++) {
      const [kitResult, kitMeta] = await db.query(
        `INSERT INTO Kit_Sample 
            (Send_Date, Receive_Date, Sample_Method, Status, BD_ID, Account_ID)
         VALUES (NULL, NULL, NULL, 'OFF', ?, ?)`,
        {
          replacements: [BD_ID, assignedStaffID],
          type: QueryTypes.INSERT,
        }
      );
      const Kit_ID = kitMeta?.insertId || kitResult;
      kitIds.push(Kit_ID);
    }

    return res.status(201).json({
      message: "Đặt lịch thành công",
      Booking_ID: bookingId,
      Cate_name: cateRow.Cate_name, // trả về nếu FE cần
    });
  } catch (err) {
    console.error(
      "Lỗi khi tạo booking:",
      err,
      err?.parent?.sqlMessage || err?.message
    );
    return res.status(500).json({
      message: "Lỗi server",
      error: err?.parent?.sqlMessage || err?.message,
    });
  }
};

// Hàm tính tổng tiền cho 1 booking_ID
// Trả về tổng tiền (number) hoặc null nếu không tìm thấy booking
exports.calculateBookingTotal = async (bookingId) => {
  try {
    if (!bookingId) {
      console.warn(
        "[calculateBookingTotal] bookingId không hợp lệ:",
        bookingId
      );
      return null;
    }
    // Lấy tất cả các Booking_Details cho bookingId
    const details = await db.query(
      `SELECT Service_ID, Quantity FROM BOOKING_DETAILS WHERE Booking_ID = ?`,
      {
        replacements: [bookingId],
        type: QueryTypes.SELECT,
      }
    );
    if (!details || details.length === 0) return null;

    let total = 0;
    for (const detail of details) {
      if (!detail.Service_ID) {
        console.warn(
          "[calculateBookingTotal] Service_ID không hợp lệ trong detail:",
          detail
        );
        continue;
      }
      // Lấy giá của service
      const [service] = await db.query(
        `SELECT Price FROM SERVICE WHERE Service_ID = ?`,
        {
          replacements: [detail.Service_ID],
          type: QueryTypes.SELECT,
        }
      );
      if (!service) {
        console.warn(
          "[calculateBookingTotal] Không tìm thấy service với ID:",
          detail.Service_ID
        );
        continue;
      }
      const price = parseInt(service.Price) || 0;
      const quantity = parseInt(detail.Quantity) || 1;
      total += price * quantity;
    }
    return total;
  } catch (err) {
    console.error("Lỗi khi tính tổng tiền booking:", err);
    return null;
  }
};

// 1. Lấy tất cả đơn hàng (join Account, Information, Service)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Account,
          attributes: ["Account_ID", "UserName", "Email", "Role"],
          include: [{ model: Information }],
        },
        {
          model: Service,
          attributes: ["Service_ID", "Service_Name", "Price"],
        },
      ],
    });
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách đơn hàng", error: err.message });
  }
};

// 2. Lấy chi tiết 1 đơn hàng
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Account,
          attributes: ["Account_ID", "UserName", "Email", "Role"],
          include: [{ model: Information }],
        },
        {
          model: Service,
          attributes: ["Service_ID", "Service_Name", "Price"],
        },
      ],
    });
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng", error: err.message });
  }
};

// 4. Sửa đơn hàng
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    await booking.update(req.body);
    res.json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật đơn hàng", error: err.message });
  }
};

// Lấy chi tiết dịch vụ của 1 booking (Booking_details + Service)
exports.getBookingDetailsWithService = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const details = await db.query(
      `SELECT bd.Quantity, s.Service_name, s.Price
       FROM Booking_details bd
       JOIN Service s ON bd.Service_ID = s.Service_ID
       WHERE bd.Booking_ID = ?`,
      {
        replacements: [bookingId],
        type: QueryTypes.SELECT,
      }
    );
    res.json({ details });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy chi tiết dịch vụ", error: err.message });
  }
};

// Lấy tổng tiền booking (dùng calculateBookingTotal)
exports.getBookingTotal = async (req, res) => {
  try {
    const total = await exports.calculateBookingTotal(req.params.id);
    res.json({ total: total ?? 0 });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy tổng tiền", error: err.message });
  }
};

// Lấy trạng thái và tổng tiền của một đơn hàng (HÀM MỚI QUAN TRỌNG)
exports.getBookingStatusAndTotal = async (req, res) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      return res.status(400).json({ message: "Thiếu mã đơn hàng" });
    }

    const [booking] = await db.query(
      `SELECT Booking_Status, PM_ID FROM Booking WHERE Booking_ID = ?`,
      {
        replacements: [bookingId],
        type: QueryTypes.SELECT,
      }
    );

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const total = await exports.calculateBookingTotal(bookingId);

    if (total === null) {
      return res
        .status(500)
        .json({ message: "Lỗi khi tính tổng tiền đơn hàng." });
    }

    res.json({
      status: booking.Booking_Status,
      isPaid: !!booking.PM_ID,
      total: total,
    });
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái và tổng tiền booking:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Hàm này lấy lịch sử booking của khách hàng
exports.getBookingsByUserEmail = async (req, res) => {
  const userEmail = req.params.email;

  if (!userEmail) {
    return res.status(400).json({ message: "Không có email được cung cấp." });
  }

  try {
    // Câu truy vấn SQL mới lấy thêm staff, receive date, receive result, shipping status
    const query = `
      SELECT
        b.Booking_ID,
        b.BookingDate,
        b.Booking_Status,
        tr.Result_PDF_URL,
        tr.Result AS TestResult,
        b.ReceiveDate,
        b.ReceiveResult,
        b.Shipping_Status,
        -- Lấy staff name cho tất cả dịch vụ có nhân viên được gán
        (
          SELECT info_staff.Name_Information
          FROM Booking_Details bd
          JOIN Kit_Sample ks ON bd.BD_ID = ks.BD_ID
          JOIN Account acc_staff ON ks.Account_ID = acc_staff.Account_ID
          JOIN Information info_staff ON acc_staff.Account_ID = info_staff.Account_ID
          WHERE bd.Booking_ID = b.Booking_ID
          LIMIT 1
        ) AS Staff_Name,
        (
          SELECT GROUP_CONCAT(s.Service_name SEPARATOR ', ')
          FROM Booking_Details bd
          JOIN Service s ON bd.Service_ID = s.Service_ID
          WHERE bd.Booking_ID = b.Booking_ID
        ) AS Service_Names
      FROM Booking b
      JOIN Information i ON b.InformationID = i.Information_ID
      JOIN ACCOUNT acc ON i.Account_ID = acc.Account_ID
      LEFT JOIN Test_Result tr ON b.Booking_ID = tr.Booking_ID
      WHERE acc.Email = ?
      ORDER BY b.BookingDate DESC
    `;

    const bookings = await db.query(query, {
      replacements: [userEmail],
      type: QueryTypes.SELECT,
    });

    res.json(bookings);
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử booking của user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    // Lấy trạng thái hiện tại
    const [booking] = await db.query(
      `SELECT Booking_Status, PM_ID FROM Booking WHERE Booking_ID = ?`,
      { replacements: [bookingId], type: QueryTypes.SELECT }
    );
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    if (booking.PM_ID) {
      return res.status(400).json({ message: "Đơn hàng đã thanh toán, không thể hủy." });
    }
    if (booking.Booking_Status === 'Đã hủy') {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó." });
    }
    await db.query(
      `UPDATE Booking SET Booking_Status = 'Đã hủy' WHERE Booking_ID = ?`,
      { replacements: [bookingId], type: QueryTypes.UPDATE }
    );
    res.json({ message: "Đã hủy đơn hàng thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi hủy đơn hàng.", error: err.message });
  }
};
