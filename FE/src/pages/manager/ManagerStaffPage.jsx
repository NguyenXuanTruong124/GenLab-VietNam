import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../../skin_web/manager/ManagerStaffPage.css"; // Tạm thời dùng chung CSS

const API_URL = "http://localhost:3001/api/manager/staff";

function ManagerStaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    gender: "Nam",
    dob: "",
    address: "",
    phone: "",
    cccd: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Manager") {
        alert("Bạn không có quyền truy cập trang này.");
        navigate("/");
      } else {
        fetchStaff(token);
      }
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchStaff = async (token) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data);
    } catch (err) {
      setError("Không thể tải danh sách nhân viên.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setError("");
    try {
      if (editId) {
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        await axios.put(`${API_URL}/${editId}`, dataToUpdate, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleCancelEdit();
      fetchStaff(token);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể lưu thông tin nhân viên."
      );
    }
  };

  // === FIX: Sửa lỗi lấy sai ID và xử lý password/date ===
  const handleEdit = (staff) => {
    const formattedDob = staff.INFORMATION?.Date_Of_Birth
      ? new Date(staff.INFORMATION.Date_Of_Birth).toISOString().split("T")[0]
      : "";
    setFormData({
      username: staff.UserName,
      password: "", // Luôn để trống password khi sửa
      email: staff.Email,
      name: staff.INFORMATION?.Name_Information || "",
      gender: staff.INFORMATION?.Gender || "Nam",
      dob: formattedDob,
      address: staff.INFORMATION?.Address || "",
      phone: staff.INFORMATION?.Phone || "",
      cccd: staff.INFORMATION?.CCCD || "",
    });
    setEditId(staff.Account_ID); // Sửa thành Account_ID
  };

  // === FIX: Sửa logic xóa thành đảo ngược trạng thái ===
  const handleToggleStatus = async (staffId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn thay đổi trạng thái của nhân viên này?"
      )
    )
      return;
    const token = localStorage.getItem("token");
    try {
      // Backend sử dụng method DELETE để xử lý việc đảo ngược trạng thái
      await axios.delete(`${API_URL}/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff(token);
    } catch (err) {
      setError("Không thể cập nhật trạng thái nhân viên.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      name: "",
      gender: "Nam",
      dob: "",
      address: "",
      phone: "",
      cccd: "",
    });
    setEditId(null);
    setError("");
  };

  return (
    <div className="manager-account-page">
      <h2>Quản lý Nhân viên</h2>
      {error && <p className="error">{error}</p>}
      <form className="account-form" onSubmit={handleFormSubmit}>
        <label>
          Username
          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={editId ? "Để trống nếu không đổi" : "Mật khẩu"}
            required={!editId}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Họ tên
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Giới tính
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </label>
        <label>
          Ngày sinh
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Địa chỉ
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          SĐT
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </label>
        <label>
          CCCD
          <input
            name="cccd"
            value={formData.cccd}
            onChange={handleInputChange}
          />
        </label>
        <div className="form-buttons">
          <button type="submit">{editId ? "Cập nhật" : "Thêm mới"}</button>
          {editId && (
            <button type="button" onClick={handleCancelEdit}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <table className="account-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.Account_ID}>
              <td>{staff.UserName}</td>
              <td>{staff.Email}</td>
              <td>{staff.INFORMATION?.Name_Information || "—"}</td>
              <td>{staff.INFORMATION?.Phone || "—"}</td>
              <td>{staff.Status === "ON" ? "Hoạt động" : "Đã khóa"}</td>
              <td>
                {/* Bọc các nút trong div này */}
                <div className="action-buttons">
                  {/* Nút Sửa */}
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(staff)}
                  >
                    Sửa
                  </button>

                  {/* Nút Khóa/Kích hoạt */}
                  <button
                    className="status-btn" // Gán class chung này
                    onClick={() => handleToggleStatus(staff.Account_ID)}
                  >
                    {staff.Status === "ON" ? "Khóa" : "Kích hoạt"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerStaffPage;
