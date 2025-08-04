// ManagerAccountPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
//import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../../skin_web/admin/ManagerAccountPage.css";

// API URL đã được sửa lại để khớp với file routes
const API_URL = "http://localhost:3001/api/admin/account";

function ManagerAccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "Customer",
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
    fetchAccounts(token);
  }, [navigate]);

  const fetchAccounts = async (token) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản.");
      console.error(err);
    }
  };

  // === FIX: Sửa logic cập nhật trạng thái ===
  const handleToggleStatus = async (accountId, currentStatus) => {
    const token = localStorage.getItem("token");
    const newStatus = currentStatus === "ON" ? "OFF" : "ON"; // Sử dụng ON/OFF
    try {
      await axios.put(
        `${API_URL}/${accountId}/status`,
        { status: newStatus }, // Gửi đi trạng thái mới
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAccounts(token); // Tải lại danh sách
    } catch (err) {
      setError("Không thể cập nhật trạng thái.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setError(""); // Xóa lỗi cũ
    try {
      if (editId) {
        // Khi cập nhật, không gửi password nếu nó rỗng
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await axios.put(`${API_URL}/${editId}`, dataToUpdate, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleCancelEdit(); // Reset form và fetch lại dữ liệu
      fetchAccounts(token);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Không thể lưu tài khoản.";
      setError(errorMessage);
      console.error(err);
    }
  };

  // === FIX: Sửa lỗi lấy sai ID và xử lý password/date ===
  const handleEdit = (acc) => {
    // Định dạng lại ngày sinh để input type="date" có thể hiển thị
    const formattedDob = acc.INFORMATION?.Date_Of_Birth
      ? new Date(acc.INFORMATION.Date_Of_Birth).toISOString().split("T")[0]
      : "";

    setFormData({
      username: acc.UserName,
      password: "", // Luôn để trống password khi sửa
      email: acc.Email,
      role: acc.Role,
      name: acc.INFORMATION?.Name_Information || "",
      gender: acc.INFORMATION?.Gender || "Nam",
      dob: formattedDob,
      address: acc.INFORMATION?.Address || "",
      phone: acc.INFORMATION?.Phone || "",
      cccd: acc.INFORMATION?.CCCD || "",
    });
    setEditId(acc.Account_ID); // Sử dụng Account_ID (có dấu gạch dưới)
  };

  const handleCancelEdit = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      role: "Customer",
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
      <h2>Quản lý Tài khoản</h2>

      <form className="account-form" onSubmit={handleFormSubmit}>
        {/* ... các input fields ... */}

        {/* ... các input fields khác giữ nguyên ... */}
        <label>
          Username
          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={editId ? "Để trống nếu không đổi" : "Password"}
            required={!editId} // Mật khẩu chỉ bắt buộc khi thêm mới
            type="password"
          />
        </label>
        <label>
          Email
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            type="email"
          />
        </label>
        <label>
          Role
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="Customer">Customer</option>
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <label>
          Họ tên
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Họ tên"
            required
          />
        </label>
        <label>
          Giới tính
          <input
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            placeholder="Giới tính"
            required
          />
        </label>
        <label>
          Ngày sinh
          <input
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            placeholder="Ngày sinh"
            type="date"
            required
          />
        </label>
        <label>
          Địa chỉ
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Địa chỉ"
          />
        </label>
        <label>
          SĐT
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="SĐT"
          />
        </label>
        <label>
          CCCD
          <input
            name="cccd"
            value={formData.cccd}
            onChange={handleInputChange}
            placeholder="CCCD"
          />
        </label>

        {error && (
          <p className="error" style={{ width: "100%", textAlign: "center" }}>
            {error}
          </p>
        )}
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
            <th>Role</th>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            // === FIX: Sử dụng đúng Account_ID cho key ===
            <tr key={acc.Account_ID}>
              <td>{acc.UserName}</td>
              <td>{acc.Email}</td>
              <td>{acc.Role}</td>
              <td>{acc.INFORMATION?.Name_Information || "—"}</td>
              <td>{acc.INFORMATION?.Phone || "—"}</td>
              {/* === FIX: So sánh với 'ON' viết hoa === */}
              <td>{acc.Status === "ON" ? "Hoạt động" : "Đã khóa"}</td>
              <td>
                <div className="action-buttons">
                  {" "}
                  {/* <== Bọc các nút trong div này */}
                  <button className="edit-btn" onClick={() => handleEdit(acc)}>
                    Sửa
                  </button>
                  <button
                    className={acc.Status === "ON" ? "lock-btn" : "unlock-btn"}
                    onClick={() =>
                      handleToggleStatus(acc.Account_ID, acc.Status)
                    }
                  >
                    {acc.Status === "ON" ? "Khóa" : "Mở khóa"}
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

export default ManagerAccountPage;
