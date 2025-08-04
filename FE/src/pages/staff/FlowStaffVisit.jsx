import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../skin_web/staff/ManageKitSamplePage.css";

function FlowStaffVisit() {
  // --- State ---
  const [data, setData] = useState([]);
  const [bookingOptions, setBookingOptions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedKit, setSelectedKit] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;
  const currentUserRole = decoded?.role;
  const [formData, setFormData] = useState({
    Send_Date: "",
    Receive_Date: "",
    Sample_Method: "",
    Sample_Status: "",
    Status: "OFF",
    BD_ID: "",
    Booking_ID: "",
    Sample_Owner: "",
    Account_ID: "",
    StaffName: "",
  });
  const [filter, setFilter] = useState({
    status: "",
    sampleStatus: "",
    staff: "",
    bookingId: "",
    sampleOwner: "",
  });
  const [editBookingId, setEditBookingId] = useState(null);
  const [editKitId, setEditKitId] = useState(null);
  const [isUpdatingKit, setIsUpdatingKit] = useState(false);
  const [isCreatingKit, setIsCreatingKit] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    Send_Date: "",
    Receive_Date: "",
    Sample_Method: "",
    Sample_Status: "",
    Status: "ON",
    BD_ID: "",
    Booking_ID: "",
    Sample_Owner: "",
    Account_ID: "",
    StaffName: "",
  });

  // --- Fetch data ---
  useEffect(() => {
    fetchKitsAndSamples();
    fetchBookingOptions();
    fetchBookings();
  }, []);
  const fetchKitsAndSamples = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/staff/kitnsample",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Chỉ lấy kit của dịch vụ nhân viên đến nhà lấy mẫu
      const filtered = res.data.filter(
        d => d.Service_name === 'Nhân viên y tế đến nhà lấy mẫu'
      );
      setData(filtered);
    } catch (err) { console.error(err); }
  };
  const fetchBookingOptions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/staff/available-bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingOptions(res.data.filter(
        b => b.Service_Names?.includes('Nhân viên y tế đến nhà lấy mẫu')
      ));
    } catch (err) { console.error(err); }
  };
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/staff/booking",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data.filter(
        b => b.Service_Names?.includes('Nhân viên y tế đến nhà lấy mẫu') && b.Booking_Status !== 'Hoàn tất'
      ));
    } catch (err) { console.error(err); }
  };

  // --- Filter, group, handleChange, handleEdit, handleUpdate, resetForm ---
  const myData = data.filter(item => String(item.Account_ID) === String(currentUserId));
  const staffNames = Array.from(new Set(myData.map(d => d.StaffName).filter(Boolean)));
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  const filteredData = myData.filter((item) => {
    if (filter.status && item.Status !== filter.status) return false;
    if (filter.sampleStatus && item.Sample_Status !== filter.sampleStatus) return false;
    if (filter.staff && item.StaffName !== filter.staff) return false;
    if (filter.bookingId && !String(item.Booking_ID).toLowerCase().includes(filter.bookingId.toLowerCase())) return false;
    if (filter.sampleOwner && !(item.Sample_Owner || '').toLowerCase().includes(filter.sampleOwner.toLowerCase())) return false;
    return true;
  });
  const groupedByBooking = filteredData.reduce((acc, item) => {
    if (!acc[item.Booking_ID]) acc[item.Booking_ID] = [];
    acc[item.Booking_ID].push(item);
    return acc;
  }, {});
  const bookingList = Object.keys(groupedByBooking);

  // --- Logic chuyển trạng thái booking, enable/disable trường ---
  const handleEditBooking = (bookingId) => {
    setEditBookingId(bookingId);
    const kits = groupedByBooking[bookingId];
    if (kits && kits.length > 0) {
      setEditKitId(kits[0].Kit_ID);
      handleEdit(kits[0]);
    }
  };
  const handleSelectKitId = (kitId) => {
    setEditKitId(kitId);
    const kit = data.find((k) => k.Kit_ID === kitId);
    if (kit) handleEdit(kit);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "BD_ID") {
      const match = bookingOptions.find((item) => item.BD_ID === value);
      if (match) {
        setFormData((prev) => ({ ...prev, BD_ID: value, Booking_ID: match.Booking_ID }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleEdit = (kit) => {
    setSelectedKit(kit.Kit_ID);
    // Nếu kit đã có ngày gửi/nhận thì ưu tiên, nếu chưa có thì lấy ngày hẹn
    let sendDate = kit.Send_Date;
    let receiveDate = kit.Receive_Date;
    const booking = bookings.find(b => b.Booking_ID === kit.Booking_ID);
    if (!sendDate && booking?.AppointmentDate) {
      sendDate = booking.AppointmentDate.split('T')[0];
    }
    if (!receiveDate && sendDate) {
      receiveDate = sendDate;
    }
    setFormData({
      Send_Date: sendDate || "",
      Receive_Date: receiveDate || "",
      Sample_Method: kit.Sample_Method || "",
      Sample_Status: kit.Sample_Status || "",
      Status: kit.Status || "OFF",
      BD_ID: kit.BD_ID,
      Account_ID: kit.Account_ID,
      StaffName: kit.StaffName || "",
      Booking_ID: kit.Booking_ID,
      Sample_Owner: kit.Sample_Owner || "",
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingKit(true);
    const kitIdToUpdate = editBookingId ? editKitId : selectedKit;
    try {
      if (!kitIdToUpdate) return;
      await axios.put(
        `http://localhost:3001/api/staff/kitnsample/${kitIdToUpdate}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Cập nhật trạng thái booking nếu đủ điều kiện
      if (editBookingId) {
        const updatedData = data.map(kit => kit.Kit_ID === kitIdToUpdate ? { ...kit, ...formData } : kit);
        setData(updatedData);
        const updatedGroupedByBooking = updatedData.reduce((acc, item) => {
          if (!acc[item.Booking_ID]) acc[item.Booking_ID] = [];
          acc[item.Booking_ID].push(item);
          return acc;
        }, {});
        const kits = updatedGroupedByBooking[editBookingId] || [];
        const firstKit = kits[0];
        const currentBookingStatus = firstKit?.Booking_Status;
        // STEP 3: "Nhân viên đã đến" → "Đã thu mẫu"
        const allKitsHaveFullInfo = kits.length > 0 && kits.every(kit => !!kit.Sample_Method && !!kit.Sample_Owner);
        if (allKitsHaveFullInfo && currentBookingStatus === 'Nhân viên đã đến') {
          await axios.put(
            `http://localhost:3001/api/staff/booking/${editBookingId}`,
            { Booking_Status: "Đã thu mẫu" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const finalUpdatedData = updatedData.map(kit => kit.Booking_ID === editBookingId ? { ...kit, Booking_Status: "Đã thu mẫu" } : kit);
          setData(finalUpdatedData);
          await fetchKitsAndSamples();
          await fetchBookings();
          alert("Đã cập nhật thành công! Trạng thái booking: Đã thu mẫu");
        }
        // STEP 4: "Đã thu mẫu" → "Đang xét nghiệm"
        const allKitsReadyForXetNghiem = kits.length > 0 && kits.every(kit => kit.Sample_Status === 'đạt chuẩn' && !!kit.Sample_Method && !!kit.Sample_Owner);
        if (allKitsReadyForXetNghiem && currentBookingStatus === 'Đã thu mẫu') {
          await axios.put(
            `http://localhost:3001/api/staff/booking/${editBookingId}`,
            { Booking_Status: "Đang xét nghiệm" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const finalUpdatedData = updatedData.map(kit => kit.Booking_ID === editBookingId ? { ...kit, Booking_Status: "Đang xét nghiệm" } : kit);
          setData(finalUpdatedData);
          await fetchKitsAndSamples();
          await fetchBookings();
          alert("Đã cập nhật thành công! Trạng thái booking: Đang xét nghiệm");
        }
      }
      alert("Đã cập nhật kit thành công!");
      await fetchKitsAndSamples();
      await fetchBookings();
      // Sau khi fetch xong, gọi lại handleEdit với kitId hiện tại
      setTimeout(() => {
        const updatedKit = data.find(k => k.Kit_ID === kitIdToUpdate);
        if (updatedKit) handleEdit(updatedKit);
      }, 200); // delay nhỏ để đảm bảo state đã cập nhật
      resetForm();
    } catch (err) {
      console.error("Lỗi cập nhật Kit:", err);
    } finally {
      setIsUpdatingKit(false);
    }
  };
  const resetForm = () => {
    setFormData({
      Send_Date: "",
      Receive_Date: "",
      Sample_Method: "",
      Status: "OFF",
      BD_ID: "",
      Account_ID: "",
      Booking_ID: "",
      StaffName: "",
      Sample_Owner: "",
    });
    // KHÔNG reset selectedKit, editBookingId, editKitId nữa
  };
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateKit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/api/staff/kitnsample",
        createFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã tạo Kit mới thành công!");
      setIsCreatingKit(false);
      resetCreateForm();
      await fetchKitsAndSamples();
      await fetchBookings();
    } catch (err) {
      console.error("Lỗi tạo Kit mới:", err);
    }
  };
  const resetCreateForm = () => {
    setCreateFormData({
      Send_Date: "",
      Receive_Date: "",
      Sample_Method: "",
      Sample_Status: "",
      Status: "ON",
      BD_ID: "",
      Booking_ID: "",
      Sample_Owner: "",
      Account_ID: "",
      StaffName: "",
    });
  };
  // --- Enable/disable trường ---
  const isKitActive = formData.Status === 'ON';
  // Lấy trạng thái booking hiện tại
  let currentBookingStatus = null;
  if (editBookingId && groupedByBooking[editBookingId] && groupedByBooking[editBookingId][0]) {
    currentBookingStatus = groupedByBooking[editBookingId][0].Booking_Status;
  } else if (formData.Booking_ID && groupedByBooking[formData.Booking_ID] && groupedByBooking[formData.Booking_ID][0]) {
    currentBookingStatus = groupedByBooking[formData.Booking_ID][0].Booking_Status;
  }
  // Chỉ mở khóa 2 trường này khi booking là 'Nhân viên đã đến'
  const enableSampleFields = currentBookingStatus === 'Nhân viên đã đến';
  const lockKitStatus = !!formData.Send_Date && !!formData.Receive_Date && !!formData.Sample_Method && !!formData.Sample_Owner;
  const lockInfoFields = !!formData.Sample_Status;
  const canEditSampleStatus = !!formData.Send_Date && !!formData.Receive_Date && !!formData.Sample_Method && !!formData.Sample_Owner;

  return (
    <div className="kit-sample-container">
      <h2>Quản lý Kit và Mẫu (Nhân viên đến nhà lấy mẫu)</h2>
      <div className="kit-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="">-- Trạng thái kit --</option>
          <option value="ON">Đang hoạt động</option>
          <option value="OFF">Ngừng hoạt động</option>
        </select>
        <select name="sampleStatus" value={filter.sampleStatus} onChange={handleFilterChange}>
          <option value="">-- Trạng thái mẫu --</option>
          <option value="đạt chuẩn">Đạt chuẩn</option>
          <option value="không đạt chuẩn">Không đạt chuẩn</option>
        </select>
        <select name="staff" value={filter.staff} onChange={handleFilterChange}>
          <option value="">-- Nhân viên phụ trách --</option>
          {staffNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input name="bookingId" value={filter.bookingId} onChange={handleFilterChange} placeholder="Tìm mã booking" style={{ minWidth: 120 }} />
        <input name="sampleOwner" value={filter.sampleOwner} onChange={handleFilterChange} placeholder="Tìm chủ sở hữu mẫu" style={{ minWidth: 120 }} />
        <button type="button" onClick={() => setFilter({ status: "", sampleStatus: "", staff: "", bookingId: "", sampleOwner: "" })}>Xóa lọc</button>
      </div>
      {/* Chỉ render form tạo mới, form chỉnh sửa hoặc bảng, không đồng thời */}
      {isCreatingKit ? (
        <form onSubmit={handleCreateKit} className="kit-form">
          <h3>Tạo Kit mới</h3>
          <label>Chọn khách hàng:</label>
          <select name="BD_ID" onChange={handleCreateChange} required>
            <option value="">-- Chọn khách hàng --</option>
            {bookingOptions.map((item) => (
              <option key={item.BD_ID} value={item.BD_ID}>
                {item.Name_Information} (Booking {item.Booking_ID})
              </option>
            ))}
          </select>
          <label>Tên khách hàng:</label>
          <input value={(() => {
            const match = bookingOptions.find(b => b.Booking_ID == createFormData.Booking_ID);
            return match?.Name_Information || "-";
          })()} readOnly />
          <label>Trạng thái kit:</label>
          <select name="Status" value={createFormData.Status} onChange={handleCreateChange}>
            <option value="ON">Đang hoạt động</option>
            <option value="OFF">Ngừng hoạt động</option>
          </select>
          <label>Ngày gửi kit:</label>
          <input type="date" name="Send_Date" value={createFormData.Send_Date} onChange={handleCreateChange} min={new Date().toISOString().split("T")[0]} />
          <label>Ngày nhận mẫu:</label>
          <input type="date" name="Receive_Date" value={createFormData.Receive_Date} onChange={handleCreateChange} min={new Date().toISOString().split("T")[0]} />
          <label>Phương pháp lấy mẫu:</label>
          <select name="Sample_Method" value={createFormData.Sample_Method} onChange={handleCreateChange}>
            <option value="">-- Chưa chọn --</option>
            <option value="Máu">Máu</option>
            <option value="Tóc">Tóc</option>
            <option value="Niêm mạc miệng">Niêm mạc miệng</option>
            <option value="Móng">Móng</option>
            <option value="Rốn">Rốn</option>
            <option value="Đặc biệt">Đặc biệt</option>
          </select>
          <label>Chủ sở hữu mẫu:</label>
          <select name="Sample_Owner" value={createFormData.Sample_Owner} onChange={handleCreateChange}>
            <option value="">-- Chưa chọn --</option>
            <option value="Cha">Cha</option>
            <option value="Mẹ">Mẹ</option>
            <option value="Con">Con</option>
            <option value="Ông">Ông</option>
            <option value="Cháu">Cháu</option>
            <option value="Anh/Chị">Anh/Chị</option>
            <option value="Em">Em</option>
          </select>
          <label>Trạng thái mẫu:</label>
          <select name="Sample_Status" value={createFormData.Sample_Status} onChange={handleCreateChange}>
            <option value="">-- Chưa chọn --</option>
            <option value="đạt chuẩn">Đạt chuẩn</option>
            <option value="không đạt chuẩn">Không đạt chuẩn</option>
          </select>
          <div className="form-buttons">
            <button type="submit">Tạo mới</button>
            <button type="button" onClick={() => { setIsCreatingKit(false); resetCreateForm(); }}>Hủy</button>
          </div>
        </form>
      ) : editBookingId && selectedKit ? (
        <>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsUpdatingKit(true);
            let alertMsg = '';
            try {
              // Cập nhật tất cả các trường chỉ cho selectedKit (không đồng bộ nữa)
              await axios.put(
                `http://localhost:3001/api/staff/kitnsample/${selectedKit}`,
                {
                  Status: formData.Status,
                  Send_Date: formData.Send_Date,
                  Receive_Date: formData.Receive_Date,
                  Sample_Method: formData.Sample_Method,
                  Sample_Owner: formData.Sample_Owner,
                  Sample_Status: formData.Sample_Status,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Xử lý chuyển trạng thái booking
              // Lấy lại dữ liệu kit mới nhất để kiểm tra điều kiện
              const kitsRes = await axios.get(
                "http://localhost:3001/api/staff/kitnsample",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const updatedKits = kitsRes.data.filter(k => k.Booking_ID === formData.Booking_ID);
              const booking = bookings.find(b => b.Booking_ID === formData.Booking_ID);
              const allHaveInfo = updatedKits.length === 2 && updatedKits.every(kit => kit.Sample_Method && kit.Sample_Owner);
              const allSampleStatus = updatedKits.length === 2 && updatedKits.every(kit => kit.Sample_Status === 'đạt chuẩn');
              let bookingStatusChanged = false;
              if (booking && booking.Booking_Status === 'Nhân viên đã đến' && allHaveInfo) {
                await axios.put(
                  `http://localhost:3001/api/staff/booking/${formData.Booking_ID}`,
                  { Booking_Status: 'Đã thu mẫu' },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alertMsg = 'Đã cập nhật thành công! Trạng thái booking: Đã thu mẫu';
                bookingStatusChanged = true;
              } else if (booking && booking.Booking_Status === 'Đã thu mẫu' && allSampleStatus) {
                await axios.put(
                  `http://localhost:3001/api/staff/booking/${formData.Booking_ID}`,
                  { Booking_Status: 'Đang xét nghiệm' },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alertMsg = 'Đã cập nhật thành công! Trạng thái booking: Đang xét nghiệm';
                bookingStatusChanged = true;
              } else {
                alertMsg = 'Đã cập nhật kit thành công!';
              }
              // Sau khi mọi cập nhật đã hoàn tất, fetch lại bookings/kits
              await fetchKitsAndSamples();
              await fetchBookings();
              // Cập nhật lại formData và giữ nguyên form đang mở
              const latestKits = await axios.get(
                "http://localhost:3001/api/staff/kitnsample",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const latestKit = latestKits.data.find(k => k.Kit_ID === selectedKit);
              if (latestKit) {
                setFormData({
                  Send_Date: latestKit.Send_Date || "",
                  Receive_Date: latestKit.Receive_Date || "",
                  Sample_Method: latestKit.Sample_Method || "",
                  Sample_Status: latestKit.Sample_Status || "",
                  Status: latestKit.Status || "OFF",
                  BD_ID: latestKit.BD_ID,
                  Account_ID: latestKit.Account_ID,
                  StaffName: latestKit.StaffName || "",
                  Booking_ID: latestKit.Booking_ID,
                  Sample_Owner: latestKit.Sample_Owner || "",
                });
              }
              alert(alertMsg);
              // KHÔNG đóng form, giữ nguyên để user tiếp tục thao tác
            } catch (err) {
              console.error('Lỗi cập nhật Kit:', err);
            } finally {
              setIsUpdatingKit(false);
            }
          }} className="kit-form">
            <h3>Chỉnh sửa Kit</h3>
            {/* Hiển thị Booking_ID đang chỉnh sửa */}
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#1976d2', fontSize: 16 }}>
              Mã Booking: {formData.Booking_ID}
            </div>
            <label>Tên khách hàng:</label>
            <input value={(() => {
              const match = bookings.find(b => b.Booking_ID == formData.Booking_ID);
              return match?.CustomerName || "-";
            })()} readOnly />
            {/* Kit_ID dropdown */}
            <label>Chọn Kit:</label>
            <select value={selectedKit} onChange={e => {
              setEditKitId(e.target.value);
              setSelectedKit(e.target.value);
              const kit = data.find(k => k.Kit_ID === e.target.value);
              if (kit) handleEdit(kit);
            }}>
              {data.filter(k => k.Booking_ID === formData.Booking_ID).map(kit => (
                <option key={kit.Kit_ID} value={kit.Kit_ID}>Kit {kit.Kit_ID}</option>
              ))}
            </select>
            <label>Trạng thái kit:</label>
            <select name="Status" value={formData.Status} onChange={handleChange}
              disabled={currentBookingStatus !== 'Đã xác nhận'}>
              <option value="ON">Đang hoạt động</option>
              <option value="OFF">Ngừng hoạt động</option>
            </select>
            <label>Ngày gửi kit:</label>
            <input type="date" name="Send_Date" value={formData.Send_Date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} disabled />
            <label>Ngày nhận mẫu:</label>
            <input type="date" name="Receive_Date" value={formData.Receive_Date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} disabled />
            <label>Phương pháp lấy mẫu:</label>
            <select name="Sample_Method" value={formData.Sample_Method} onChange={handleChange} disabled={formData.Status === 'OFF' || currentBookingStatus !== 'Nhân viên đã đến'}>
              <option value="">-- Chưa chọn --</option>
              <option value="Máu">Máu</option>
              <option value="Tóc">Tóc</option>
              <option value="Niêm mạc miệng">Niêm mạc miệng</option>
              <option value="Móng">Móng</option>
              <option value="Rốn">Rốn</option>
              <option value="Đặc biệt">Đặc biệt</option>
            </select>
            <label>Chủ sở hữu mẫu:</label>
            <select name="Sample_Owner" value={formData.Sample_Owner} onChange={handleChange} disabled={formData.Status === 'OFF' || currentBookingStatus !== 'Nhân viên đã đến'}>
              <option value="">-- Chưa chọn --</option>
              <option value="Cha">Cha</option>
              <option value="Mẹ">Mẹ</option>
              <option value="Con">Con</option>
              <option value="Ông">Ông</option>
              <option value="Cháu">Cháu</option>
              <option value="Anh/Chị">Anh/Chị</option>
              <option value="Em">Em</option>
            </select>
            <label>Trạng thái mẫu:</label>
            <select name="Sample_Status" value={formData.Sample_Status} onChange={handleChange}
              disabled={formData.Status === 'OFF' || !(data.filter(k => k.Booking_ID === formData.Booking_ID).length === 2 && data.filter(k => k.Booking_ID === formData.Booking_ID).every(kit => kit.Sample_Method && kit.Sample_Owner))}>
              <option value="">-- Chưa chọn --</option>
              <option value="đạt chuẩn">Đạt chuẩn</option>
              <option value="không đạt chuẩn">Không đạt chuẩn</option>
            </select>
            <div className="form-buttons">
              <button type="submit" disabled={isUpdatingKit}>Lưu</button>
              <button type="button" onClick={() => { setEditBookingId(null); setSelectedKit(null); }}>Hủy</button>
            </div>
          </form>
          {/* Hiển thị bảng booking hiện tại bên dưới form */}
          <table style={{ marginTop: 32 }}>
            <thead>
              <tr>
                <th>Mã Booking</th>
                <th>Tên khách hàng</th>
                <th>Số lượng Kit</th>
                {currentUserRole === "Manager" && <th>Nhân viên phụ trách</th>}
                <th>Trạng thái booking</th>
                <th>Loại quan hệ xét nghiệm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const bookingId = formData.Booking_ID;
                const firstKit = groupedByBooking[bookingId]?.[0];
                if (!firstKit) return null;
                return (
                  <tr key={bookingId}>
                    <td>{bookingId}</td>
                    <td>{firstKit?.CustomerName || "-"}</td>
                    <td>{groupedByBooking[bookingId].length}</td>
                    {currentUserRole === "Manager" && <td>{firstKit?.StaffName || "-"}</td>}
                    <td>{firstKit?.Booking_Status || "-"}</td>
                    <td>{firstKit?.Cate_name || "-"}</td>
                    <td>
                      {firstKit?.Account_ID === currentUserId && (
                        <button
                          onClick={() => handleEditBooking(bookingId)}
                          disabled={firstKit?.Booking_Status === 'Đã hủy' || firstKit?.Booking_Status === 'Hoàn tất'}
                          style={
                            firstKit?.Booking_Status === 'Đã hủy' || firstKit?.Booking_Status === 'Hoàn tất'
                              ? { background: '#ccc', color: '#666', cursor: 'not-allowed' }
                              : {}
                          }
                        >
                          Chỉnh sửa
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã Booking</th>
              <th>Tên khách hàng</th>
              <th>Số lượng Kit</th>
              {currentUserRole === "Manager" && <th>Nhân viên phụ trách</th>}
              <th>Trạng thái booking</th>
              <th>Loại quan hệ xét nghiệm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Tạo mới button ở đầu bảng, chỉ hiển thị khi không edit/không tạo mới */}
            {(!editBookingId && !selectedKit && !isCreatingKit) && (
              <tr>
                <td colSpan={currentUserRole === "Manager" ? 7 : 6} style={{ textAlign: 'right', padding: 8 }}>
                  <button onClick={() => setIsCreatingKit(true)} style={{ background: '#007bff', color: '#fff', padding: '6px 16px', borderRadius: 4, border: 'none', cursor: 'pointer' }}>
                    Tạo mới
                  </button>
                </td>
              </tr>
            )}
            {bookingList.map((bookingId) => {
              const firstKit = groupedByBooking[bookingId][0];
              return (
                <tr key={bookingId}>
                  <td>{bookingId}</td>
                  <td>{firstKit?.CustomerName || "-"}</td>
                  <td>{groupedByBooking[bookingId].length}</td>
                  {currentUserRole === "Manager" && <td>{firstKit?.StaffName || "-"}</td>}
                  <td>{firstKit?.Booking_Status || "-"}</td>
                  <td>{firstKit?.Cate_name || "-"}</td>
                  <td>
                    {firstKit?.Account_ID === currentUserId && (
                      <button
                        onClick={() => handleEditBooking(bookingId)}
                        disabled={firstKit?.Booking_Status === 'Đã hủy' || firstKit?.Booking_Status === 'Hoàn tất'}
                        style={
                          firstKit?.Booking_Status === 'Đã hủy' || firstKit?.Booking_Status === 'Hoàn tất' 
                            ? { background: '#ccc', color: '#666', cursor: 'not-allowed' } 
                            : {}
                        }
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default FlowStaffVisit;
