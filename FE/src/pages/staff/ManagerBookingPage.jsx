import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../../skin_web/staff/ManagerBookingPage.css";

function ManagerBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [kits, setKits] = useState([]); // Thêm state kits
  const [editId, setEditId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    Booking_Status: "",
    AppointmentDate: "",
    ReceiveDate: "",
    ReceiveResult: "",
    Checkin_Status: "Chưa đến",
  });

  const [filter, setFilter] = useState({
    status: "",
    staff: "",
    dateFrom: "",
    dateTo: "",
    shipping: "",
    receiveResult: "",
    search: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [showCheckinUpload, setShowCheckinUpload] = useState(null); // Booking_ID đang upload ảnh
  const [checkinFile, setCheckinFile] = useState(null);
  const [isUploadingCheckin, setIsUploadingCheckin] = useState(false);
  // Track number of times 'Không gửi được kết quả' is selected per booking
  const [failCount, setFailCount] = useState({});

  const statusOptions = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Nhân viên đã đến",
    "Đang gửi kit",
    "Đã thu mẫu",
    "Đang xét nghiệm",
    "Hoàn tất",
    "Đang hủy",
    "Đã hủy",
  ];
  const progressStatuses = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Nhân viên đã đến",
    "Đang gửi kit",
    "Đã thu mẫu",
    "Đang xét nghiệm",
    "Hoàn tất",
  ];
  const receiveResultOptions = ["Tại cơ sở", "Gửi về địa chỉ"];
  const shippingStatusOptions = [
    "Không có",
    "Đang vận chuyển kết quả",
    "Đã gửi kết quả",
    "Không gửi được kết quả",
  ];

  useEffect(() => {
    if (!token) return navigate("/login");
    const decoded = jwtDecode(token);
    if (!["Staff", "Manager"].includes(decoded.role)) {
      alert("Không có quyền truy cập");
      return navigate("/");
    }
    setCurrentUserId(decoded.id);
    setCurrentUserRole(decoded.role);
    fetchBookings();
    // Fetch kitnsample
    axios.get("http://localhost:3001/api/staff/kitnsample", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setKits(res.data))
      .catch(() => setKits([]));
  }, []);

  useEffect(() => {
    if (currentUserRole === "Manager") {
      axios
        .get("http://localhost:3001/api/staff/list", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStaffList(res.data))
        .catch(() => setStaffList([]));
    }
  }, [currentUserRole, token]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/staff/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueBookings = Array.from(
        new Map(res.data.map((item) => [item.Booking_ID, item])).values()
      );
      // Sort by BookingDate DESC (newest first)
      uniqueBookings.sort((a, b) => new Date(b.BookingDate) - new Date(a.BookingDate));
      setBookings(uniqueBookings);
    } catch (err) {
      console.error("Không thể tải danh sách booking");
    }
  };

  const handleEdit = (booking) => {
    setEditId(booking.Booking_ID);
    setUploadingId(null);
    // Nếu trạng thái booking là 'Hoàn tất', luôn set Booking_Status là 'Hoàn tất' vào formData
    setFormData({
      Booking_Status: booking.Booking_Status === 'Hoàn tất' ? 'Hoàn tất' : booking.Booking_Status,
      AppointmentDate: booking.AppointmentDate?.split("T")[0] || "",
      ReceiveDate: booking.ReceiveDate?.split("T")[0] || "",
      ReceiveResult: booking.ReceiveResult || "",
      Staff_ID: booking.Staff_ID || "",
      Shipping_Status: booking.Shipping_Status || "Không có",
      Checkin_Status: booking.Checkin_Status || "Chưa đến",
    });
    // Reset fail count when editing a booking
    setFailCount({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special logic for Shipping_Status
    if (name === "Shipping_Status" && value === "Không gửi được kết quả") {
      setFailCount((prev) => {
        const count = (prev[editId] || 0) + 1;
        return { ...prev, [editId]: count };
      });
    } else if (name === "Shipping_Status" && value === "Đã gửi kết quả") {
      setFailCount((prev) => ({ ...prev, [editId]: 0 }));
      
      // Khi trạng thái vận chuyển là 'Đã gửi kết quả', giữ nguyên giá trị hiện tại của các trường bị khóa
      // Không cần thay đổi gì thêm vì các trường sẽ bị disabled
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ràng buộc ngày hẹn và ngày nhận kết quả không được là quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0); // so sánh chỉ theo ngày
    if (formData.AppointmentDate) {
      const appointmentDate = new Date(formData.AppointmentDate);
      if (appointmentDate < today) {
        alert("Ngày hẹn không được là ngày trong quá khứ!");
        return;
      }
    }
    if (formData.ReceiveDate) {
      const receiveDate = new Date(formData.ReceiveDate);
      if (receiveDate < today) {
        alert("Ngày nhận kết quả không được là ngày trong quá khứ!");
        return;
      }
    }
    try {
      let isSentKit = false;
      let isStaffHome = false;
      
      // Tạo payload để gửi lên server, loại bỏ các trường bị khóa
      const createPayload = () => {
        const payload = { ...formData, Shipping_Status: formData.Shipping_Status || "Không có" };
        
        // Nếu trạng thái vận chuyển là 'Đã gửi kết quả', loại bỏ các trường bị khóa
        if (formData.Shipping_Status === 'Đã gửi kết quả') {
          delete payload.ReceiveDate;
          delete payload.ReceiveResult;
        }
        
        return payload;
      };
      // Nếu có file ảnh check-in thì upload trước
      if (checkinFile) {
        const formImg = new FormData();
        formImg.append("checkinImage", checkinFile);
        await axios.post(
          `http://localhost:3001/api/staff/booking/${editId}/upload-checkin`,
          formImg,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Kiểm tra loại dịch vụ để cập nhật trạng thái phù hợp
        const booking = bookings.find(b => b.Booking_ID === editId);
        if (booking && booking.Service_Names) {
          if (booking.Service_Names.includes("Xét nghiệm ADN tự lấy mẫu tại nhà")) {
            isSentKit = true;
          } else if (booking.Service_Names.includes("Nhân viên y tế đến nhà lấy mẫu")) {
            isStaffHome = true;
          }
        }
        setCheckinFile(null);
      }
      // Nếu chỉ thay đổi Shipping_Status, chỉ gửi trường này lên backend
      if (
        Object.keys(formData).filter(k => k !== 'Shipping_Status').every(k => formData[k] === bookings.find(b => b.Booking_ID === editId)?.[k])
      ) {
        await axios.put(
          `http://localhost:3001/api/staff/booking/${editId}`,
          { Shipping_Status: formData.Shipping_Status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Đã cập nhật trạng thái vận chuyển thành công!");
        setEditId(null);
        fetchBookings();
        return;
      }
      // Nếu chọn Checkin_Status là 'Không đến', cập nhật trạng thái booking thành 'Đã hủy'
      if (formData.Checkin_Status === 'Không đến') {
        const payload = createPayload();
        payload.Booking_Status = 'Đã hủy';
        
        await axios.put(
          `http://localhost:3001/api/staff/booking/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Khách không đến. Trạng thái booking đã chuyển thành 'Đã hủy'.");
        setEditId(null);
        fetchBookings();
        return;
      }
      // Cập nhật booking status dựa trên loại dịch vụ
      if (isSentKit) {
        // Dịch vụ tự lấy mẫu tại nhà: cập nhật thành "Đã gửi kit"
        const payload = createPayload();
        payload.Booking_Status = "Đã gửi kit";
        
        await axios.put(
          `http://localhost:3001/api/staff/booking/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Đã cập nhật thành công! Trạng thái booking: Đã gửi kit");
      } else if (isStaffHome) {
        // Dịch vụ nhân viên y tế đến nhà: cập nhật thành "Nhân viên đã đến"
        const payload = createPayload();
        payload.Booking_Status = "Nhân viên đã đến";
        
        await axios.put(
          `http://localhost:3001/api/staff/booking/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Đã cập nhật thành công! Trạng thái booking: Nhân viên đã đến");
      } else {
        // Các dịch vụ khác: chỉ gửi Booking_Status nếu thực sự thay đổi
        const booking = bookings.find(b => b.Booking_ID === editId);
        const payload = createPayload();
        
        // Nếu trạng thái booking trong DB là 'Hoàn tất', luôn giữ nguyên 'Hoàn tất'
        if (booking && booking.Booking_Status === 'Hoàn tất') {
          payload.Booking_Status = 'Hoàn tất';
        } else if (booking && formData.Booking_Status === booking.Booking_Status) {
          // Không gửi Booking_Status nếu không đổi
          delete payload.Booking_Status;
        }
        
        // Không gửi Booking_Status nếu chỉ thay đổi Shipping_Status
        if (
          Object.keys(formData).filter(k => k !== 'Shipping_Status').every(k => formData[k] === booking?.[k])
        ) {
          await axios.put(
            `http://localhost:3001/api/staff/booking/${editId}`,
            { Shipping_Status: formData.Shipping_Status },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Đã cập nhật trạng thái vận chuyển thành công!");
          setEditId(null);
          fetchBookings();
          return;
        }
        
        await axios.put(
          `http://localhost:3001/api/staff/booking/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Đã cập nhật thành công! Trạng thái booking: ${booking && booking.Booking_Status === 'Hoàn tất' ? 'Hoàn tất' : formData.Booking_Status}`);
      }
      setEditId(null);
      fetchBookings();
    } catch (err) {
      console.error("Cập nhật thất bại");
    }
  };

  const handleStartUpload = (bookingId) => {
    setUploadingId(bookingId);
    setEditId(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Vui lòng chọn một file PDF.");
      return;
    }

    const fileData = new FormData();
    fileData.append("resultPdf", selectedFile);
    setIsUploading(true);

    try {
      await axios.post(
        `http://localhost:3001/api/staff/booking/${uploadingId}/upload-result`,
        fileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(
        "Tải lên kết quả thành công. Trạng thái đã cập nhật thành 'Hoàn tất'."
      );
      setUploadingId(null);
      setSelectedFile(null);
      fetchBookings();
    } catch (err) {
      console.error(
        "Lỗi khi tải lên file:",
        err.response?.data?.message || err.message
      );
      alert(`Tải lên thất bại: ${err.response?.data?.message || "Lỗi server"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowCheckinUpload = (bookingId) => {
    setShowCheckinUpload(bookingId);
    setCheckinFile(null);
  };

  const handleCheckinFileChange = (e) => {
    setCheckinFile(e.target.files[0]);
  };

  const handleCheckinUpload = async (bookingId) => {
    if (!checkinFile) return;
    setIsUploadingCheckin(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("checkinImage", checkinFile);
    try {
      await axios.post(
        `http://localhost:3001/api/staff/booking/${bookingId}/upload-checkin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Sau khi upload ảnh thành công, kiểm tra loại dịch vụ
      const booking = bookings.find(b => b.Booking_ID === bookingId);
      if (booking && booking.Service_Names) {
        if (booking.Service_Names.includes("Xét nghiệm ADN tự lấy mẫu tại nhà")) {
          // Gọi API cập nhật trạng thái cho dịch vụ tự lấy mẫu tại nhà
          await axios.put(
            `http://localhost:3001/api/staff/booking/${bookingId}`,
            { Booking_Status: "Đã gửi kit" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (booking.Service_Names.includes("Nhân viên y tế đến nhà lấy mẫu")) {
          // Gọi API cập nhật trạng thái cho dịch vụ nhân viên y tế đến nhà
          await axios.put(
            `http://localhost:3001/api/staff/booking/${bookingId}`,
            { Booking_Status: "Nhân viên đã đến" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      setShowCheckinUpload(null);
      setCheckinFile(null);
      fetchBookings();
    } catch (err) {
      alert("Tải lên ảnh thất bại: " + (err.response?.data?.message || "Lỗi server"));
    } finally {
      setIsUploadingCheckin(false);
    }
  };

  // Hàm kiểm tra tất cả các kit của booking đã đủ điều kiện
  const allKitsReady = (bookingId) => {
    // Giả sử bookings không chứa kit, cần fetch hoặc truyền từ props nếu có
    // Ở đây sẽ fetch từ API hoặc truyền vào nếu có groupedByBooking
    // Nếu không có groupedByBooking, bỏ qua kiểm tra (cho phép đổi trạng thái)
    if (!window.groupedByBooking) return true;
    const kits = window.groupedByBooking[bookingId] || [];
    return kits.length > 0 && kits.every(kit => !!kit.Receive_Date && !!kit.Sample_Status && !!kit.Status);
  };

  // Sửa hàm handleUploadResultPdf để kiểm tra điều kiện trước khi upload
  const handleUploadResultPdf = async (e, bookingId) => {
    e.preventDefault();
    // Kiểm tra điều kiện kit trước khi cho upload
    if (window.groupedByBooking && !allKitsReady(bookingId)) {
      alert("Bạn phải nhập đầy đủ ngày nhận mẫu, trạng thái mẫu và trạng thái kit cho tất cả các kit trước khi hoàn tất!");
      return;
    }
    if (!selectedFile) {
      alert("Vui lòng chọn một file PDF.");
      return;
    }
    const fileData = new FormData();
    fileData.append("resultPdf", selectedFile);
    setIsUploading(true);
    try {
      await axios.post(
        `http://localhost:3001/api/staff/booking/${bookingId}/upload-result`,
        fileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Tải lên kết quả thành công. Trạng thái đã cập nhật thành 'Hoàn tất'.");
      setSelectedFile(null);
      fetchBookings();
    } catch (err) {
      alert("Tải lên thất bại: " + (err.response?.data?.message || "Lỗi server"));
    } finally {
      setIsUploading(false);
    }
  };

  const currentStatusIndex = progressStatuses.indexOf(formData.Booking_Status);
  const allowedStatuses = statusOptions.filter((status) => {
    const index = progressStatuses.indexOf(status);
    return (
      status !== "Đã xác nhận" && (index === -1 || index >= currentStatusIndex)
    );
  });

  const canEdit = (booking) => {
    return (
      currentUserRole === "Manager" ||
      (currentUserRole === "Staff" && booking.Staff_ID === currentUserId)
    );
  };

  // FILTER UI + LOGIC
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Lấy danh sách ngày hẹn duy nhất, đã sort tăng dần
  const appointmentDates = Array.from(
    new Set(bookings.map(b => b.AppointmentDate && b.AppointmentDate.split('T')[0]).filter(Boolean))
  ).sort((a, b) => new Date(a) - new Date(b));

  const filteredBookings = bookings.filter((b) => {
    // Nếu là nhân viên thì chỉ thấy booking của mình
    if (currentUserRole === "Staff" && b.Staff_ID !== currentUserId) return false;
    // Trạng thái
    if (filter.status && b.Booking_Status !== filter.status) return false;
    // Nhân viên phụ trách
    if (filter.staff && String(b.Staff_ID) !== filter.staff) return false;
    // Ngày hẹn (dropdown)
    if (filter.appointmentDate && b.AppointmentDate?.split('T')[0] !== filter.appointmentDate) return false;
    // Ngày đặt từ
    if (filter.dateFrom && new Date(b.BookingDate) < new Date(filter.dateFrom)) return false;
    // Ngày đặt đến
    if (filter.dateTo && new Date(b.BookingDate) > new Date(filter.dateTo)) return false;
    // Trạng thái vận chuyển
    if (filter.shipping && b.Shipping_Status !== filter.shipping) return false;
    // Hình thức nhận kết quả
    if (filter.receiveResult && b.ReceiveResult !== filter.receiveResult) return false;
    // Tìm kiếm nhanh theo mã booking hoặc tên khách
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      if (
        !String(b.Booking_ID).toLowerCase().includes(searchLower) &&
        !(b.CustomerName && b.CustomerName.toLowerCase().includes(searchLower))
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="staff-sample-page">
      <h2>Quản lý Booking</h2>

      {/* FILTER UI */}
      <form className="booking-filter-bar-modern" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'center', background: '#f8fafd', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #e0e7ef' }}
        onSubmit={e => { e.preventDefault(); /* filter tự động, không cần submit */ }}>
        <select name="status" value={filter.status} onChange={handleFilterChange} className="filter-select">
          <option value="">Trạng thái</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="staff" value={filter.staff} onChange={handleFilterChange} className="filter-select">
          <option value="">Nhân viên phụ trách</option>
          {staffList.map((s) => (
            <option key={s.Account_ID} value={s.Account_ID}>{s.Name_Information}</option>
          ))}
        </select>
        <select name="appointmentDate" value={filter.appointmentDate || ""} onChange={handleFilterChange} className="filter-select">
          <option value="">Ngày hẹn</option>
          {appointmentDates.map((d) => (
            <option key={d} value={d}>{new Date(d).toLocaleDateString("vi-VN")}</option>
          ))}
        </select>
        <input type="date" name="dateFrom" value={filter.dateFrom} onChange={handleFilterChange} className="filter-date" placeholder="Từ ngày" />
        <input type="date" name="dateTo" value={filter.dateTo} onChange={handleFilterChange} className="filter-date" placeholder="Đến ngày" />
        <select name="shipping" value={filter.shipping} onChange={handleFilterChange} className="filter-select">
          <option value="">Trạng thái vận chuyển</option>
          {shippingStatusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="receiveResult" value={filter.receiveResult} onChange={handleFilterChange} className="filter-select">
          <option value="">Hình thức nhận</option>
          {receiveResultOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input name="search" value={filter.search} onChange={handleFilterChange} className="filter-search" placeholder="Tìm mã booking hoặc tên khách" style={{ minWidth: 180 }} />
        <button type="button" className="filter-btn" onClick={() => setFilter({ status: "", staff: "", appointmentDate: "", dateFrom: "", dateTo: "", shipping: "", receiveResult: "", search: "" })}>Xóa lọc</button>
      </form>

      {editId && (() => {
        const booking = bookings.find(b => b.Booking_ID === editId);
        if (!booking || booking.Booking_Status === 'Đã hủy') return null;
        const isDone = booking.Booking_Status === 'Hoàn tất';
        // Nếu đang xét nghiệm thì chỉ hiển thị form upload PDF
        if (booking.Booking_Status === "Đang xét nghiệm") {
          return (
            <form onSubmit={e => handleUploadResultPdf(e, booking.Booking_ID)} className="sample-form">
              <h3>Tải lên kết quả PDF cho #{booking.Booking_ID}</h3>
              <label>Chọn file PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              <div className="form-buttons">
                <button type="submit" disabled={isUploading || !selectedFile}>
                  {isUploading ? "Đang tải lên..." : "Tải lên & Hoàn tất"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  disabled={isUploading}
                >
                  Hủy
                </button>
              </div>
            </form>
          );
        }
        // Ngược lại, render form cập nhật booking như cũ
        return (
          <form onSubmit={handleSubmit} className="sample-form">
            <h3>Cập nhật Booking #{editId}</h3>

            {/* Hiển thị Checkin_Status nếu là các dịch vụ đặc biệt */}
            {(() => {
              const booking = bookings.find(b => b.Booking_ID === editId);
              if (booking && [
                "Xét nghiệm ADN tại cơ sở y tế",
                "Hành chính (tại CSYT)",
                "Tư vấn"
              ].some(type => booking.Service_Names && booking.Service_Names.includes(type))) {
                // Lấy danh sách kit của booking này
                const kitsForBooking = kits.filter(k => k.Booking_ID === booking.Booking_ID);
                // Nếu cả 2 kit đều đang hoạt động thì enable, ngược lại disable
                const allKitsActive = kitsForBooking.length === 2 && kitsForBooking.every(k => k.Status === 'ON');
                // Chỉ mở khi booking status là "Đã xác nhận", còn lại khóa hết
                const isLocked = formData.Booking_Status !== "Đã xác nhận";
                return (
                  <>
                    <label>Trạng thái Check-in:</label>
                    <select
                      name="Checkin_Status"
                      value={formData.Checkin_Status}
                      onChange={handleChange}
                      disabled={isLocked}
                    >
                      <option value="Chưa đến">Chưa đến</option>
                      <option value="Đã đến">Đã đến</option>
                      <option value="Không đến">Không đến</option>
                    </select>
                  </>
                );
              }
              return null;
            })()}

            {/* THÊM: Hiển thị trường Nhân viên checkIn cho dịch vụ nhân viên y tế đến nhà */}
            {(() => {
              const booking = bookings.find(b => b.Booking_ID === editId);
              if (booking && booking.Service_Names && booking.Service_Names.includes("Nhân viên y tế đến nhà lấy mẫu")) {
                // Lấy danh sách kit của booking này
                const kitsForBooking = kits.filter(k => k.Booking_ID === booking.Booking_ID);
                // Nếu cả 2 kit đều không phải 'Đang hoạt động' thì disable
                const allKitsNotActive = kitsForBooking.length === 2 && kitsForBooking.every(k => k.Status !== 'ON');
                // Xác định trạng thái hiện tại
                const statusOrder = ["Đã xác nhận", "Nhân viên đang đến", "Nhân viên đã đến"];
                const currentStatusIndex = statusOrder.indexOf(formData.Booking_Status);
                // Chỉ cho phép chọn trạng thái tiếp theo
                let allowedStatuses = [];
                if (currentStatusIndex === 0) allowedStatuses = [statusOrder[0], statusOrder[1]];
                else if (currentStatusIndex === 1) allowedStatuses = [statusOrder[1], statusOrder[2]];
                else if (currentStatusIndex === 2) allowedStatuses = [statusOrder[2]];
                const isFinalStatus = currentStatusIndex === 2;
                return (
                  <>
                    <label>Nhân viên checkIn:</label>
                    <select
                      name="Booking_Status"
                      value={formData.Booking_Status}
                      onChange={handleChange}
                      disabled={isDone || isFinalStatus || allKitsNotActive}
                    >
                      {allowedStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </>
                );
              }
              return null;
            })()}

            {/* Trường Ngày hẹn luôn hiển thị và bị khóa (disabled) */}
            <label>Ngày hẹn:</label>
            <input
              type="date"
              name="AppointmentDate"
              value={formData.AppointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              disabled
            />

            {/* Nếu KHÔNG phải dịch vụ Tư vấn thì hiển thị 3 trường này */}
            {(() => {
              const isAdvice = booking && booking.Service_Names && booking.Service_Names.includes("Tư vấn");
              if (isAdvice) return null;
              // const isDone = formData.Booking_Status === "Hoàn tất"; // đã có ở trên
              return (
                <>
                  {/* Trạng thái vận chuyển: Cho phép chỉnh sửa nếu ReceiveResult là 'Gửi về địa chỉ' */}
                  {formData.ReceiveResult === 'Gửi về địa chỉ' && (() => {
                    // Logic cho Shipping_Status
                    let shippingOptions = shippingStatusOptions;
                    let disabled = formData.Booking_Status !== 'Hoàn tất';
                    const failTimes = failCount[editId] || 0;
                    if (formData.Shipping_Status === 'Đang vận chuyển kết quả') {
                      shippingOptions = ['Đang vận chuyển kết quả', 'Đã gửi kết quả', 'Không gửi được kết quả'];
                    }
                    if (formData.Shipping_Status === 'Đã gửi kết quả') {
                      disabled = true;
                    }
                    if (formData.Shipping_Status === 'Không gửi được kết quả' && failTimes >= 3) {
                      disabled = true;
                    }
                    return (
                      <>
                        <label>Trạng thái vận chuyển:</label>
                        <select
                          name="Shipping_Status"
                          value={formData.Shipping_Status}
                          onChange={handleChange}
                          disabled={disabled}
                        >
                          <option value="">-- Chọn --</option>
                          {shippingOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {/* Hiển thị số lần chọn 'Không gửi được kết quả' nếu có */}
                        {formData.Shipping_Status === 'Không gửi được kết quả' && failTimes > 0 && failTimes < 3 && (
                          <div style={{ color: '#f39c12', fontSize: 12 }}>
                            Đã chọn "Không gửi được kết quả" {failTimes}/3 lần. Sau 3 lần sẽ khóa trường này.
                          </div>
                        )}
                        {formData.Shipping_Status === 'Không gửi được kết quả' && failTimes >= 3 && (
                          <div style={{ color: 'red', fontSize: 12 }}>
                            Đã chọn "Không gửi được kết quả" 3 lần. Trường này đã bị khóa.
                          </div>
                        )}
                      </>
                    );
                  })()}

                  <label>Ngày nhận kết quả:</label>
                  <input
                    type="date"
                    name="ReceiveDate"
                    value={formData.ReceiveDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={formData.Shipping_Status === 'Đã gửi kết quả'}
                  />
                  {formData.Shipping_Status === 'Đã gửi kết quả' && (
                    <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>
                      Không thể thay đổi vì kết quả đã được gửi thành công
                    </div>
                  )}

                  <label>Phương thức nhận:</label>
                  <select
                    name="ReceiveResult"
                    value={formData.ReceiveResult}
                    onChange={handleChange}
                    disabled={formData.Shipping_Status === 'Đã gửi kết quả'}
                  >
                    <option value="">-- Chọn --</option>
                    {receiveResultOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {formData.Shipping_Status === 'Đã gửi kết quả' && (
                    <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>
                      Không thể thay đổi vì kết quả đã được gửi thành công
                    </div>
                  )}
                </>
              );
            })()}

            {/* Nếu là 2 loại dịch vụ này thì hiển thị input upload ảnh check-in */}
            {(() => {
              const isShowCheckin = [
                "Xét nghiệm ADN tự lấy mẫu tại nhà",
                "Nhân viên y tế đến nhà lấy mẫu"
              ].some(type => booking.Service_Names && booking.Service_Names.includes(type));

              // Chỉ cho phép upload ảnh check-in khi trạng thái phù hợp
              const canUploadCheckin = (() => {
                if (booking.Service_Names && booking.Service_Names.includes("Xét nghiệm ADN tự lấy mẫu tại nhà")) {
                  return booking.Booking_Status === "Đang gửi kit";
                }
                if (booking.Service_Names && booking.Service_Names.includes("Nhân viên y tế đến nhà lấy mẫu")) {
                  return booking.Booking_Status === "Nhân viên đã đến";
                }
                return false;
              })();

              if (!isShowCheckin || !canUploadCheckin) return null;
              return (
                <div style={{ marginBottom: 12 }}>
                  <label>Ảnh check-in:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCheckinFileChange}
                  />
                  {booking.ChekinImage && (
                    <div style={{ marginTop: 6 }}>
                      <a href={`http://localhost:3001${booking.ChekinImage}`} target="_blank" rel="noopener noreferrer">Xem ảnh hiện tại</a>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Chỉ cho phép upload file PDF khi trạng thái là 'Đang xét nghiệm' */}
            {booking.Booking_Status === "Đang xét nghiệm" && (
              <form onSubmit={e => handleUploadResultPdf(e, booking.Booking_ID)} className="sample-form">
                <h3>Tải lên kết quả PDF cho #{booking.Booking_ID}</h3>
                <label>Chọn file PDF:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                />
                <div className="form-buttons">
                  <button type="submit" disabled={isUploading || !selectedFile}>
                    {isUploading ? "Đang tải lên..." : "Tải lên & Hoàn tất"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadingId(null)}
                    disabled={isUploading}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {currentUserRole === "Manager" && (
              <>
                <label>Nhân viên phụ trách:</label>
                <select
                  name="Staff_ID"
                  value={formData.Staff_ID || ""}
                  onChange={handleChange}
                >
                  <option value="">Chọn nhân viên</option>
                  {staffList.map((staff) => (
                    <option key={staff.Account_ID} value={staff.Account_ID}>
                      {staff.Name_Information}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="form-buttons">
              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setEditId(null)}>
                Hủy
              </button>
            </div>
          </form>
        );
      })()}
      {uploadingId && (
        <form onSubmit={handleUploadSubmit} className="sample-form">
          <h3>Tải lên kết quả PDF cho #{uploadingId}</h3>
          <label>Chọn file PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          <div className="form-buttons">
            <button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? "Đang tải lên..." : "Tải lên & Hoàn tất"}
            </button>
            <button
              type="button"
              onClick={() => setUploadingId(null)}
              disabled={isUploading}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Trạng thái</th>
            <th>Tên dịch vụ</th>
            <th>Loại quan hệ xét nghiệm</th>
            <th>Ngày đặt</th>
            <th>Ngày hẹn</th>
            <th>Ngày nhận kết quả</th>
            <th>Trạng thái vận chuyển</th>
            <th>Hình thức nhận kết quả</th>
            <th>Kết quả xét nghiệm(File PDF)</th>
            <th>Ảnh check-in</th>
            <th>Đánh giá của khách</th>
            {currentUserRole === "Manager" && <th>Nhân viên phụ trách</th>}
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((b) => {
            // Loại bỏ phần trong ngoặc ở tên dịch vụ
            const serviceName = b.Service_Names ? b.Service_Names.replace(/\s*\([^)]*\)/g, "").trim() : "-";
            return (
              <tr key={b.Booking_ID}>
                <td>{b.Booking_ID}</td>
                <td>{b.CustomerName || "-"}</td>
                <td>{b.Booking_Status}</td>
                <td>{serviceName}</td>
                <td>{b.Cate_Names || "-"}</td>
                <td>{new Date(b.BookingDate).toLocaleDateString("vi-VN")}</td>
                <td>
                  {b.Service_Names && b.Service_Names.includes("Xét nghiệm ADN tự lấy mẫu tại nhà")
                    ? (() => {
                      const kitsForBooking = kits.filter(k => k.Booking_ID === b.Booking_ID && k.Send_Date);
                      if (kitsForBooking.length === 0) return "-";
                      // Lấy ngày gửi kit nhỏ nhất
                      const minSendDate = kitsForBooking
                        .map(k => new Date(k.Send_Date))
                        .sort((a, b) => a - b)[0];
                      return minSendDate
                        ? minSendDate.toLocaleDateString("vi-VN")
                        : "-";
                    })()
                    : (b.AppointmentDate
                      ? new Date(b.AppointmentDate).toLocaleDateString("vi-VN")
                      : "-")
                  }</td>
                <td>
                  {b.ReceiveDate
                    ? new Date(b.ReceiveDate).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td>{b.Shipping_Status || "-"}</td>
                <td>{b.ReceiveResult || "-"}</td>
                <td>
                  {b.Result_PDF_URL ? (
                    <a
                      href={`http://localhost:3001${b.Result_PDF_URL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      Xem PDF{" "}
                    </a>
                  ) : (
                    "Chưa có"
                  )}
                </td>
                <td>
                  {b.ChekinImage ? (
                    <a
                      href={`http://localhost:3001${b.ChekinImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem ảnh
                    </a>
                  ) : (
                    "Chưa có"
                  )}
                </td>
                <td>
                  {b.Booking_Status === "Hoàn tất" ? (
                    <button
                      onClick={() => navigate(`/danh-gia/${b.Booking_ID}`)}
                      style={{
                        background: "#f39c12",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Xem đánh giá
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                {currentUserRole === "Manager" && <td>{b.Staff_Name || "-"}</td>}
                <td>
                  {(currentUserRole === "Manager" || (currentUserRole === "Staff" && b.Staff_ID === currentUserId)) && (
                    <button
                      onClick={() => b.Booking_Status !== 'Đã hủy' && handleEdit(b)}
                      style={{ background: b.Booking_Status === 'Đã hủy' ? '#ccc' : undefined, color: b.Booking_Status === 'Đã hủy' ? '#666' : undefined, cursor: b.Booking_Status === 'Đã hủy' ? 'not-allowed' : 'pointer' }}
                      disabled={b.Booking_Status === 'Đã hủy'}
                    >
                      Cập nhật
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerBookingPage;
