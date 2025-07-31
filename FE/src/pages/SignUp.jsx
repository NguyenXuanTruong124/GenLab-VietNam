import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../skin_web/SignUp.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    cccd: "",
  });
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/register",
        form
      );
      setMessage(res.data.message || "Đăng ký thành công!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/otp", { state: { email: form.email, password: form.password } });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Đăng ký thất bại";
      setMessage(errorMsg);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="form-title">Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="username">Tên đăng nhập</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Tên đăng nhập"
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Mật khẩu</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <label htmlFor="name">Họ tên</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Họ tên"
          onChange={handleChange}
          required
        />
        <label htmlFor="gender">Giới tính</label>
        <select name="gender" id="gender" onChange={handleChange} required>
          <option value="">Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <label htmlFor="dob">Ngày sinh</label>
        <input
          type="date"
          name="dob"
          id="dob"
          placeholder="Ngày sinh"
          onChange={handleChange}
          required
          max={new Date().toISOString().split("T")[0]}
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
        />
        <label htmlFor="address">Địa chỉ</label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Địa chỉ"
          onChange={handleChange}
          required
        />
        <label htmlFor="phone">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Số điện thoại"
          onChange={handleChange}
          required
        />
        <label htmlFor="cccd">CCCD</label>
        <input
          type="text"
          name="cccd"
          id="cccd"
          placeholder="CCCD"
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      {message && !showToast && <p>{message}</p>}
      {showToast && (
        <div
          className={`toast-success${toastType === "error" ? " toast-error" : ""}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
