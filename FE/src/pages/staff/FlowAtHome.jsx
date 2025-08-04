import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../skin_web/staff/ManageKitSamplePage.css";

function FlowAtHome() {
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
    sendDate: "",
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
      // Chỉ lấy kit của dịch vụ tự lấy mẫu tại nhà
      const filtered = res.data.filter(
        d => d.Service_name === 'Xét nghiệm ADN tự lấy mẫu tại nhà'
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
        b => b.Service_Names?.includes('Xét nghiệm ADN tự lấy mẫu tại nhà')
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
        b => b.Service_Names?.includes('Xét nghiệm ADN tự lấy mẫu tại nhà') && b.Booking_Status !== 'Hoàn tất'
      ));
    } catch (err) { console.error(err); }
  };

  // --- Filter, group, handleChange, handleEdit, handleUpdate, resetForm ---
  const myData = data.filter(item => String(item.Account_ID) === String(currentUserId));
  const sendDates = Array.from(
    new Set(myData.map(d => d.Send_Date && d.Send_Date.split('T')[0]).filter(Boolean))
  ).sort((a, b) => new Date(a) - new Date(b));
  const staffNames = Array.from(new Set(myData.map(d => d.StaffName).filter(Boolean)));
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  const filteredData = myData.filter((item) => {
    if (filter.status && item.Status !== filter.status) return false;
    if (filter.sampleStatus && item.Sample_Status !== filter.sampleStatus) return false;
    if (filter.sendDate && item.Send_Date?.split('T')[0] !== filter.sendDate) return false;
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
  // Chọn kit_id: luôn reset form về đúng dữ liệu gốc của kit đó
  const handleSelectKitId = (kitId) => {
    setEditKitId(kitId);
    const kit = data.find((k) => k.Kit_ID === kitId);
    if (kit) handleEdit(kit);
  };
  // Sửa lại handleChange để chỉ cập nhật formData, không ảnh hưởng đến data của các kit khác
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSendDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Luôn lấy lại dữ liệu gốc từ data khi đổi kit
  const handleEdit = (kit) => {
    setSelectedKit(kit.Kit_ID);
    setFormData({
      Send_Date: kit.Send_Date || "",
      Receive_Date: kit.Receive_Date || "",
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
    try {
      const kitIdToUpdate = editBookingId ? editKitId : selectedKit;
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
        // LOGIC MỚI: Nếu tất cả các kit đều có Sample_Status là 'đạt chuẩn' thì chuyển booking sang 'Đang xét nghiệm'.
        const allKitsReadyForXetNghiem = kits.length > 0 && kits.every(kit => kit.Sample_Status === 'đạt chuẩn');
        // Khai báo lại các biến này để dùng cho các nhánh else if phía sau
        const anyKitFullInfo = kits.some(kit => !!kit.Send_Date && !!kit.Receive_Date && !!kit.Sample_Method && !!kit.Sample_Owner);
        const anyKitHasSendDate = kits.some(kit => !!kit.Send_Date);
        // Lấy trạng thái hiện tại của booking
        const booking = bookings.find(b => b.Booking_ID === editBookingId);
        const currentStatus = booking?.Booking_Status;
        // LOGIC MỚI: Chỉ cho phép chuyển trạng thái tiến lên
        if (allKitsReadyForXetNghiem && ['Đã thu mẫu'].includes(currentStatus)) {
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
        } else if (anyKitFullInfo && ['Đã gửi kit'].includes(currentStatus)) {
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
        } else if (anyKitHasSendDate && ['Đã xác nhận'].includes(currentStatus)) {
          await axios.put(
            `http://localhost:3001/api/staff/booking/${editBookingId}`,
            { Booking_Status: "Đang gửi kit" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const finalUpdatedData = updatedData.map(kit => kit.Booking_ID === editBookingId ? { ...kit, Booking_Status: "Đang gửi kit" } : kit);
          setData(finalUpdatedData);
          await fetchKitsAndSamples();
          await fetchBookings();
          alert("Đã cập nhật thành công! Trạng thái booking: Đang gửi kit");
        }
      }
      alert("Đã cập nhật kit thành công!");
      await fetchKitsAndSamples();
      await fetchBookings();
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
    setSelectedKit(null);
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
  // Lấy trạng thái booking hiện tại
  let currentBookingStatus = null;
  if (editBookingId && groupedByBooking[editBookingId] && groupedByBooking[editBookingId][0]) {
    currentBookingStatus = groupedByBooking[editBookingId][0].Booking_Status;
  } else if (formData.Booking_ID && groupedByBooking[formData.Booking_ID] && groupedByBooking[formData.Booking_ID][0]) {
    currentBookingStatus = groupedByBooking[formData.Booking_ID][0].Booking_Status;
  }
  const isKitActive = formData.Status === 'ON';
  const hasSendDate = !!formData.Send_Date;
  // Nếu booking là 'Đã gửi kit' thì chỉ mở 3 trường, còn lại disable
  const isBookingSent = currentBookingStatus === 'Đã gửi kit';
  // Để khóa trường ngày gửi kit và trạng thái kit:
  // Nếu kit này đã có ngày gửi kit => khóa
  // Nếu kit này chưa có ngày gửi kit => vẫn mở, kể cả booking đã gửi kit
  const thisKitHasSendDate = !!formData.Send_Date;
  const disableKitStatus = thisKitHasSendDate;
  const enableSendDate = !thisKitHasSendDate;

  const bookingAllowInput = [
    "Đã gửi kit",
    "Đã thu mẫu",
    "Đang xét nghiệm",
    "Hoàn tất"
  ];
  const enableInfoFields = bookingAllowInput.includes(currentBookingStatus) && thisKitHasSendDate;
  // Các trường khác đều disable nếu chưa có ngày gửi kit hoặc chưa phải 'Đã gửi kit'
  const disableOtherFields = !enableInfoFields;
  // Các logic cũ giữ lại cho các bước sau
  const hasAllInfoFields = !!formData.Send_Date && !!formData.Receive_Date && !!formData.Sample_Method && !!formData.Sample_Owner;
  const lockInfoFields = !!formData.Sample_Status;
  // Ràng buộc mới cho trường Trạng thái mẫu
  let canEditSampleStatus = false;
  if (currentBookingStatus === 'Đã thu mẫu') {
    // Lấy tất cả kit của booking này
    const kitsOfBooking = groupedByBooking[formData.Booking_ID] || [];
    // Phải có ít nhất 2 kit và tất cả đều đủ 3 trường Receive_Date, Sample_Method, Sample_Owner
    canEditSampleStatus = kitsOfBooking.length >= 2 && kitsOfBooking.every(kit => kit.Receive_Date && kit.Sample_Method && kit.Sample_Owner);
  } else {
    canEditSampleStatus = !!formData.Send_Date && !!formData.Receive_Date && !!formData.Sample_Method && !!formData.Sample_Owner;
  }

  // useEffect: chỉ gọi handleEdit khi data thay đổi do fetch lại hoặc khi vào edit lần đầu
  useEffect(() => {
    if (editBookingId && editKitId && data.length > 0) {
      const kit = data.find(k => k.Kit_ID === editKitId);
      if (kit) handleEdit(kit);
    } else if (selectedKit && data.length > 0 && !editBookingId) {
      const kit = data.find(k => k.Kit_ID === selectedKit);
      if (kit) handleEdit(kit);
    }
  }, [data, editBookingId, editKitId, selectedKit]);

  return (
    <div className="kit-sample-container">
      <h2>Quản lý Kit và Mẫu (Tự lấy mẫu tại nhà)</h2>
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
        <select name="sendDate" value={filter.sendDate} onChange={handleFilterChange}>
          <option value="">-- Ngày gửi kit --</option>
          {sendDates.map((d) => (
            <option key={d} value={d}>{new Date(d).toLocaleDateString("vi-VN")}</option>
          ))}
        </select>
        <select name="staff" value={filter.staff} onChange={handleFilterChange}>
          <option value="">-- Nhân viên phụ trách --</option>
          {staffNames.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input name="bookingId" value={filter.bookingId} onChange={handleFilterChange} placeholder="Tìm mã booking" style={{ minWidth: 120 }} />
        <input name="sampleOwner" value={filter.sampleOwner} onChange={handleFilterChange} placeholder="Tìm chủ sở hữu mẫu" style={{ minWidth: 120 }} />
        <button type="button" onClick={() => setFilter({ status: "", sampleStatus: "", sendDate: "", staff: "", bookingId: "", sampleOwner: "" })}>Xóa lọc</button>
      </div>
      {/* Chỉ render form tạo mới hoặc bảng, không đồng thời */}
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
              // Cập nhật độc lập cho từng kit
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
              // Fetch lại dữ liệu mới nhất
              await fetchKitsAndSamples();
              await fetchBookings();
              // Lấy lại kit và booking mới nhất
              const kitsRes = await axios.get(
                "http://localhost:3001/api/staff/kitnsample",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const updatedKits = kitsRes.data.filter(k => k.Booking_ID === formData.Booking_ID);
              const latestKit = kitsRes.data.find(k => k.Kit_ID === selectedKit);
              const booking = bookings.find(b => b.Booking_ID === formData.Booking_ID);
              // Flow logic
              let bookingStatusChanged = false;
              // 2. Nếu cả 2 kit đều có ngày gửi kit thì chuyển trạng thái booking sang 'Đã gửi kit'
              const allKitsHasSendDate = updatedKits.length === 2 && updatedKits.every(kit => kit.Send_Date);
              if (booking && booking.Booking_Status === 'Đã xác nhận' && allKitsHasSendDate) {
                await axios.put(
                  `http://localhost:3001/api/staff/booking/${formData.Booking_ID}`,
                  { Booking_Status: 'Đã gửi kit' },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alertMsg = 'Đã cập nhật thành công! Trạng thái booking: Đã gửi kit';
                bookingStatusChanged = true;
              }
              // 3. Nếu booking status là 'Đã gửi kit', và có ÍT NHẤT 1 kit có cả ngày gửi và ngày nhận mẫu, thì chuyển sang 'Đã thu mẫu'
              const anyKitHasSendAndReceive = updatedKits.some(kit => kit.Send_Date && kit.Receive_Date);
              if (booking && booking.Booking_Status === 'Đã gửi kit' && anyKitHasSendAndReceive) {
                await axios.put(
                  `http://localhost:3001/api/staff/booking/${formData.Booking_ID}`,
                  { Booking_Status: 'Đã thu mẫu' },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alertMsg = 'Đã cập nhật thành công! Trạng thái booking: Đã thu mẫu';
                bookingStatusChanged = true;
              }
              // 4. Nếu trạng thái mẫu là 'đạt chuẩn' cho cả 2 kit, chuyển booking sang 'Đang xét nghiệm' và khóa hết
              const allSampleStatus = updatedKits.length === 2 && updatedKits.every(kit => kit.Sample_Status === 'đạt chuẩn');
              if (booking && booking.Booking_Status === 'Đã thu mẫu' && allSampleStatus) {
                await axios.put(
                  `http://localhost:3001/api/staff/booking/${formData.Booking_ID}`,
                  { Booking_Status: 'Đang xét nghiệm' },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alertMsg = 'Đã cập nhật thành công! Trạng thái booking: Đang xét nghiệm';
                bookingStatusChanged = true;
              }
              if (!alertMsg) alertMsg = 'Đã cập nhật kit thành công!';
              if (bookingStatusChanged) {
                await fetchBookings();
              }
              // Sau khi cập nhật, fetch lại kits/bookings và cập nhật lại formData với kit mới nhất (giống FlowStaffVisit)
              await fetchKitsAndSamples();
              await fetchBookings();
              // Cập nhật lại formData và giữ nguyên form đang mở
              const latestKitsAfterUpdate = await axios.get(
                "http://localhost:3001/api/staff/kitnsample",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const latestKitAfterUpdate = latestKitsAfterUpdate.data.find(k => k.Kit_ID === selectedKit);
              if (latestKitAfterUpdate) {
                setFormData({
                  Send_Date: latestKitAfterUpdate.Send_Date || "",
                  Receive_Date: latestKitAfterUpdate.Receive_Date || "",
                  Sample_Method: latestKitAfterUpdate.Sample_Method || "",
                  Sample_Status: latestKitAfterUpdate.Sample_Status || "",
                  Status: latestKitAfterUpdate.Status || "OFF",
                  BD_ID: latestKitAfterUpdate.BD_ID,
                  Account_ID: latestKitAfterUpdate.Account_ID,
                  StaffName: latestKitAfterUpdate.StaffName || "",
                  Booking_ID: latestKitAfterUpdate.Booking_ID,
                  Sample_Owner: latestKitAfterUpdate.Sample_Owner || "",
                });
              }
              alert(alertMsg);
            } catch (err) {
              console.error('Lỗi cập nhật Kit:', err);
            } finally {
              setIsUpdatingKit(false);
            }
          }} className="kit-form">
            <h3>Chỉnh sửa Kit</h3>
            <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#1976d2', fontSize: 16 }}>
              Mã Booking: {formData.Booking_ID}
            </div>
            <label>Tên khách hàng:</label>
            <input value={(() => {
              const match = bookings.find(b => b.Booking_ID == formData.Booking_ID);
              return match?.CustomerName || "-";
            })()} readOnly />
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
              disabled={!(currentBookingStatus === 'Đã xác nhận' || currentBookingStatus === 'Đang gửi kit')}>
              <option value="ON">Đang hoạt động</option>
              <option value="OFF">Ngừng hoạt động</option>
            </select>
            <label>Ngày gửi kit:</label>
            <input type="date" name="Send_Date" value={formData.Send_Date} onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              disabled={!(currentBookingStatus === 'Đã xác nhận' || currentBookingStatus === 'Đang gửi kit') || formData.Status !== 'ON'} />
            <label>Ngày nhận mẫu:</label>
            <input type="date" name="Receive_Date" value={formData.Receive_Date} onChange={handleChange} min={new Date().toISOString().split("T")[0]}
              disabled={!(currentBookingStatus === 'Đã gửi kit' || currentBookingStatus === 'Đã thu mẫu')} />
            <label>Phương pháp lấy mẫu:</label>
            <select name="Sample_Method" value={formData.Sample_Method} onChange={handleChange} disabled={!(currentBookingStatus === 'Đã gửi kit' || currentBookingStatus === 'Đã thu mẫu')}>
              <option value="">-- Chưa chọn --</option>
              <option value="Máu">Máu</option>
              <option value="Tóc">Tóc</option>
              <option value="Niêm mạc miệng">Niêm mạc miệng</option>
              <option value="Móng">Móng</option>
              <option value="Rốn">Rốn</option>
              <option value="Đặc biệt">Đặc biệt</option>
            </select>
            <label>Chủ sở hữu mẫu:</label>
            <select name="Sample_Owner" value={formData.Sample_Owner} onChange={handleChange} disabled={!(currentBookingStatus === 'Đã gửi kit' || currentBookingStatus === 'Đã thu mẫu')}>
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
              disabled={(() => {
                if (currentBookingStatus !== 'Đã thu mẫu') return true;
                // Lấy tất cả kit của booking này
                const kitsOfBooking = data.filter(k => k.Booking_ID === formData.Booking_ID);
                // Phải có ít nhất 2 kit và tất cả đều đủ 3 trường Receive_Date, Sample_Method, Sample_Owner
                return !(kitsOfBooking.length >= 2 && kitsOfBooking.every(kit => kit.Receive_Date && kit.Sample_Method && kit.Sample_Owner));
              })()}>
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
export default FlowAtHome;
