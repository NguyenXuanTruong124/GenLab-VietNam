import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// Changed CSS path to match the new CSS file we are creating
import "../../skin_web/manager/ManagerServicePage.css";

const API_URL = "http://localhost:3001/api/manager/service";

function ManagerServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    Service_name: "",
    Description: "",
    Sample_Method: "",
    Estimated_Time: "",
    Price: "",
    Status: "ON",
  });

  // State mới để lưu trữ dữ liệu gốc khi chỉnh sửa
  const [originalServiceData, setOriginalServiceData] = useState(null);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Manager" && decoded.role !== "Admin") {
        alert("Bạn không có quyền truy cập trang này.");
        navigate("/");
      } else {
        fetchServices(token);
      }
    } catch (err) {
      console.error("Token không hợp lệ hoặc đã hết hạn", err);
      navigate("/login");
    }
  }, [navigate]);

  const fetchServices = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setError("");

    // Trường hợp 1: Cập nhật dịch vụ
    if (editId) {
      // Tạo một payload mới. Nếu trường nào bị để trống, sẽ lấy giá trị cũ.
      const updatePayload = {};
      for (const key in formData) {
        const newValue =
          typeof formData[key] === "string"
            ? formData[key].trim()
            : formData[key];
        const oldValue = originalServiceData[key];
        // Ưu tiên giá trị mới nếu nó tồn tại, ngược lại dùng giá trị cũ
        updatePayload[key] = newValue || oldValue;
      }

      try {
        await axios.put(`${API_URL}/${editId}`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleCancelEdit();
        fetchServices(token);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể cập nhật dịch vụ.");
      }
      return; // Kết thúc hàm sau khi cập nhật
    }

    // Trường hợp 2: Tạo dịch vụ mới
    // Kiểm tra tất cả các trường phải được điền đầy đủ
    for (const key in formData) {
      if (
        key !== "Status" &&
        (formData[key] === null || String(formData[key]).trim() === "")
      ) {
        setError(
          "Vui lòng điền đầy đủ tất cả các trường thông tin để tạo dịch vụ mới."
        );
        return; // Dừng việc gửi form
      }
    }

    try {
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleCancelEdit();
      fetchServices(token);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể thêm dịch vụ mới.");
    }
  };

  const handleEdit = (service) => {
    // Lưu lại dữ liệu gốc của dịch vụ đang sửa
    setOriginalServiceData(service);

    setFormData({
      Service_name: service.Service_name,
      Description: service.Description,
      Sample_Method: service.Sample_Method || "",
      Estimated_Time: service.Estimated_Time || "",
      Price: service.Price,
      Status: service.Status,
    });
    setEditId(service.Service_ID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn vô hiệu hóa dịch vụ này?"))
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices(token);
    } catch (err) {
      setError("Không thể vô hiệu hóa dịch vụ.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      Service_name: "",
      Description: "",
      Sample_Method: "",
      Estimated_Time: "",
      Price: "",
      Status: "ON",
    });
    setEditId(null);
    setOriginalServiceData(null); // Xóa dữ liệu gốc
    setError("");
  };

  // Removed inline styles from the outer div
  return (
    <div className="page-wrapper">
      <div className="manager-service-page redesign">
        <h2>Quản lý Dịch vụ & Giá</h2>
        <div className="manager-content">
          <form className="service-form" onSubmit={handleFormSubmit}>
            <h3>{editId ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}</h3>
            {error && <p className="error-message">{error}</p>}
            <label htmlFor="Service_name">Tên dịch vụ (*)</label>
            <input
              type="text"
              id="Service_name"
              name="Service_name"
              placeholder="Nhập tên dịch vụ"
              value={formData.Service_name}
              onChange={handleInputChange}
              required={!editId}
            />
            <label htmlFor="Description">Mô tả (*)</label>
            <textarea
              id="Description"
              name="Description"
              placeholder="Nhập mô tả dịch vụ"
              value={formData.Description}
              onChange={handleInputChange}
              required={!editId}
            />
            <label htmlFor="Sample_Method">Phương pháp lấy mẫu (*)</label>
            <input
              type="text"
              id="Sample_Method"
              name="Sample_Method"
              placeholder="Nhập phương pháp lấy mẫu"
              value={formData.Sample_Method}
              onChange={handleInputChange}
              required={!editId}
            />
            <label htmlFor="Estimated_Time">Thời gian ước tính (*)</label>
            <input
              type="text"
              id="Estimated_Time"
              name="Estimated_Time"
              placeholder="Nhập thời gian ước tính"
              value={formData.Estimated_Time}
              onChange={handleInputChange}
              required={!editId}
            />
            <label htmlFor="Price">Giá dịch vụ (*)</label>
            <input
              type="number"
              id="Price"
              name="Price"
              placeholder="Nhập giá dịch vụ"
              value={formData.Price}
              onChange={handleInputChange}
              required={!editId}
              min="0"
            />
            <label htmlFor="Status">Trạng thái</label>
            <select
              id="Status"
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
            >
              <option value="ON">Bật</option>
              <option value="OFF">Tắt</option>
            </select>
            <div className="form-buttons">
              <button type="submit">{editId ? "Cập nhật" : "Thêm mới"}</button>
              {editId && (
                <button type="button" onClick={handleCancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </form>

          <div className="service-table-wrapper">
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <table className="service-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên dịch vụ</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th className="action-header">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.Service_ID}>
                      <td>{service.Service_ID}</td>
                      <td>{service.Service_name}</td>
                      <td className="description-cell">
                        {service.Description}
                      </td>
                      <td>{parseFloat(service.Price).toLocaleString()} đ</td>
                      <td>{service.Status === "ON" ? "Bật" : "Tắt"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(service)}
                            className="edit-btn"
                          >
                            Sửa
                          </button>
                          {service.Status === "ON" && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(service.Service_ID)}
                            >
                              Vô hiệu hóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagerServicePage;
