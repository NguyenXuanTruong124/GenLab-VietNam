import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import "../skin_web/FormTesting.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serviceIdMap = {
  "Xét nghiệm ADN tại cơ sở y tế": 1,
  "Xét nghiệm ADN tự lấy mẫu tại nhà": 2,
  "Nhân viên y tế đến nhà lấy mẫu": 3,
  "Hành chính (tại CSYT)": 4,
  "Tư vấn": 5,
};

const availableHours = [
  "08:00:00",
  "09:00:00",
  "10:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
];

export default function BookingForm({ formType: propFormType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const formType =
    propFormType ||
    location.state?.formType ||
    localStorage.getItem("formType") ||
    null;

  useEffect(() => {
    if (formType) localStorage.setItem("formType", formType);
  }, [formType]);

  const serviceNameMap = {
    MedicalFacility: "Xét nghiệm ADN tại cơ sở y tế",
    SendSampling: "Xét nghiệm ADN tự lấy mẫu tại nhà",
    HomeSampling: "Nhân viên y tế đến nhà lấy mẫu",
    AdminFacility: "Hành chính (tại CSYT)",
    Advice: "Tư vấn",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    relationshipType: "",
    note: "",
    receiveResult: "",
    appointmentDate: "",
    appointmentHour: "",
    serviceName: formType === "Free" ? "Tư vấn" : (serviceNameMap[formType] || ""),
  });

  const [accountId, setAccountId] = useState(null);
  const [filteredHours, setFilteredHours] = useState(availableHours);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id?.toString() || decoded.Account_ID?.toString();
      setAccountId(id);
      setFormData((prev) => ({
        ...prev,
        email: decoded.email || decoded.username || "",
      }));

      axios
        .get(`http://localhost:3001/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { information } = res.data;
          if (information) {
            setFormData((prev) => ({
              ...prev,
              name: prev.name || information.Name_Information || "",
              phone: prev.phone || information.Phone || "",
              address: prev.address || information.Address || "",
            }));
          }
        })
        .catch((err) =>
          console.error("❌ Không thể lấy thông tin hồ sơ:", err)
        );
    } catch (err) {
      console.error("❌ Token không hợp lệ:", err);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = formData.appointmentDate;
    if (!selectedDate) return;

    if (selectedDate === today) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // Chỉ cho phép đặt giờ >= 2 tiếng sau thời điểm hiện tại
      const filtered = availableHours.filter((hourStr) => {
        const [h, m] = hourStr.split(":").map(Number);
        const hourDiff = h - currentHour;
        if (hourDiff > 2) return true;
        if (hourDiff === 2 && m > currentMinute) return true;
        return false;
      });
      setFilteredHours(filtered);
      if (!filtered.includes(formData.appointmentHour)) {
        setFormData((prev) => ({ ...prev, appointmentHour: "" }));
      }
    } else {
      setFilteredHours(availableHours);
    }
  }, [formData.appointmentDate, formData.appointmentHour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCateName = (code) => {
    const map = {
      C001: "Quan hệ cha-con",
      C002: "Quan hệ mẹ-con",
      C003: "Quan hệ ông-cháu nội",
      C004: "Quan hệ anh-em ruột",
    };
    return map[code] || "";
  };

  // Khi submit, gửi categoryId là relationshipType
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để đặt lịch. Đang chuyển đến trang đăng nhập...");
      navigate("/signin");
      return;
    }

    const service_ID = serviceIdMap[formData.serviceName] || null;
    const isAdvice = service_ID === 5 || formData.serviceName === "Tư vấn";
    let payload;
    if (isAdvice) {
      payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointmentDate: formData.appointmentDate,
        appointmentHour: formData.appointmentHour,
        note: formData.note,
        service_ID,
        serviceName: formData.serviceName,
        categoryId: "C005", // mã tư vấn đúng trong DB
      };
    } else {
      payload = {
        ...formData,
        categoryId: formData.relationshipType, // gửi mã (C001, C002, ...)
        service_ID,
      };
    }

    if (!service_ID) {
      toast.error("Vui lòng chọn dịch vụ.");
      return;
    }
    if (!isAdvice && !payload.categoryId) {
      toast.error("Vui lòng chọn loại xét nghiệm.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/booking/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.Booking_ID) {
        toast.success(`Đặt lịch thành công! Mã đơn hàng của bạn là: ${response.data.Booking_ID}`);
        setTimeout(() => {
          navigate("/lich-su");
        }, 1500);
      } else {
        toast.error("Đặt lịch thất bại: " + (response.data?.message || "Không rõ lỗi"));
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi yêu cầu:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể tạo lịch hẹn. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  const renderFormFields = () => {
    const service_ID = serviceIdMap[formData.serviceName] || null;
    const isAdvice = service_ID === 5 || formData.serviceName === "Tư vấn";
    if (isAdvice) {
      return (
        <>
          <label>Họ và tên người đăng ký:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Số điện thoại liên hệ:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Ngày hẹn:</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate || ""}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />

          <label>Giờ hẹn:</label>
          <select
            name="appointmentHour"
            value={formData.appointmentHour}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn giờ hẹn --</option>
            {filteredHours.map((hour) => (
              <option key={hour} value={hour}>
                {hour === "08:00:00"
                  ? "08:00 sáng"
                  : hour === "09:00:00"
                  ? "09:00 sáng"
                  : hour === "10:00:00"
                  ? "10:00 sáng"
                  : hour === "14:00:00"
                  ? "14:00 chiều"
                  : hour === "15:00:00"
                  ? "15:00 chiều"
                  : hour === "16:00:00"
                  ? "16:00 chiều"
                  : hour}
              </option>
            ))}
          </select>

          <label>Ghi chú thêm (nếu có):</label>
          <textarea name="note" value={formData.note} onChange={handleChange} />
        </>
      );
    }
    return (
      <>
        <label>Họ và tên người đăng ký:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Số điện thoại liên hệ:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {(formData.serviceName === "Xét nghiệm ADN tự lấy mẫu tại nhà" ||
          formData.serviceName === "Nhân viên y tế đến nhà lấy mẫu") && (
          <>
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Ẩn loại xét nghiệm nếu là Tư vấn */}
        {!isAdvice && (
          <>
            <label>Loại xét nghiệm:</label>
            <select
              name="relationshipType"
              value={formData.relationshipType}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn loại xét nghiệm --</option>
              <option value="C001">Quan hệ cha-con</option>
              <option value="C002">Quan hệ mẹ-con</option>
              <option value="C003">Quan hệ ông-cháu nội</option>
              <option value="C004">Quan hệ anh-em ruột</option>
            </select>
          </>
        )}

        {formType !== "SendSampling" && (
          <>
            <label>Ngày hẹn:</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate || ""}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />

            <label>Giờ hẹn:</label>
            <select
              name="appointmentHour"
              value={formData.appointmentHour}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn giờ hẹn --</option>
              {filteredHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour === "08:00:00"
                    ? "08:00 sáng"
                    : hour === "09:00:00"
                    ? "09:00 sáng"
                    : hour === "10:00:00"
                    ? "10:00 sáng"
                    : hour === "14:00:00"
                    ? "14:00 chiều"
                    : hour === "15:00:00"
                    ? "15:00 chiều"
                    : hour === "16:00:00"
                    ? "16:00 chiều"
                    : hour}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Chỉ hiển thị phương thức nhận nếu KHÔNG phải dịch vụ tư vấn */}
        {!isAdvice && (
          <>
            <label>Phương thức nhận kết quả:</label>
            <select
              name="receiveResult"
              value={formData.receiveResult}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn phương thức --</option>
              <option value="Tại cơ sở">Tại cơ sở</option>
              <option value="Gửi về địa chỉ">Gửi về địa chỉ</option>
            </select>
          </>
        )}

        <label>Ghi chú thêm (nếu có):</label>
        <textarea name="note" value={formData.note} onChange={handleChange} />
      </>
    );
  };

  const getTitle = () => {
    switch (formType) {
      case "SendSampling":
        return "XÉT NGHIỆM QUA GỬI MẪU";
      case "HomeSampling":
        return "XÉT NGHIỆM QUA NHÂN VIÊN LẤY MẪU";
      case "MedicalFacility":
        return "XÉT NGHIỆM DÂN SỰ";
      case "AdminFacility":
        return "XÉT NGHIỆM HÀNH CHÍNH";
      default:
        return "ĐẶT LỊCH XÉT NGHIỆM";
    }
  };

  return (
    <div
      className={
        formType === "HomeSampling"
          ? "home-sampling-container"
          : "medical-container"
      }
    >
      <h2 className="form-title">{getTitle()}</h2>

      {formType === "AdminFacility" && (
        <div className="alert-box">
          <p>
            <strong>⚠ Lưu ý quan trọng:</strong> Khi đến cơ sở y tế để làm xét
            nghiệm, bạn cần:
          </p>
          <ul>
            <li>
              Đem theo <strong>giấy tờ tùy thân</strong> (CMND/CCCD, hộ
              chiếu,...)
            </li>
            <li>
              Trường hợp pháp lý: cần có <strong>giấy tờ liên quan</strong>{" "}
              (công văn, quyết định,...)
            </li>
            <li>
              Tải và điền sẵn mẫu đơn tại đây:
              <a
                href="/files/Form.docx"
                download
                style={{ color: "#0077cc", marginLeft: "5px" }}
              >
                [Tải Mẫu Đơn]
              </a>
            </li>
          </ul>
        </div>
      )}

      <form
        className={
          formType === "HomeSampling" ? "home-sampling-form" : "medical-form"
        }
        onSubmit={handleSubmit}
      >
        {renderFormFields()}
        <button type="submit" style={{ marginTop: "1rem" }}>
          Xác nhận đặt lịch
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
