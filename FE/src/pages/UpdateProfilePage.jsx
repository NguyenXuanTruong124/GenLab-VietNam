import React, { useEffect, useState } from "react";
import axios from "axios";
import "../skin_web/UpdateProfilePage.css";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
    const [form, setForm] = useState({
        Name_Information: "",
        Gender: "",
        Date_Of_Birth: "",
        Address: "",
        Phone: "",
        CCCD: ""
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy thông tin hiện tại để fill form
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id || user?.AccountID;
                const res = await axios.get(`http://localhost:3001/api/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.information) {
                    setForm(res.data.information);
                }
            } catch (err) {
                setMessage("Không thể tải thông tin hồ sơ.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id || user?.AccountID;
            await axios.put(
                `http://localhost:3001/api/profile/${userId}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Cập nhật thành công!");
            setTimeout(() => {
                navigate("/profile");
                window.location.reload();
            }, 1200);
        } catch (err) {
            setMessage("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    if (loading) return <div className="update-profile-loading">Đang tải thông tin...</div>;

    return (
        <div className="update-profile-container">
            <form className="update-profile-form" onSubmit={handleSubmit}>
                <h2>Cập nhật hồ sơ</h2>
                {message && <div className="update-profile-message">{message}</div>}
                <label>
                    Họ tên
                    <input
                        type="text"
                        name="Name_Information"
                        value={form.Name_Information}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Giới tính
                    <select
                        name="Gender"
                        value={form.Gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </label>
                <label>
                    Ngày sinh
                    <input
                        type="date"
                        name="Date_Of_Birth"
                        value={form.Date_Of_Birth ? form.Date_Of_Birth.slice(0, 10) : ""}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Địa chỉ
                    <input
                        type="text"
                        name="Address"
                        value={form.Address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Số điện thoại
                    <input
                        type="text"
                        name="Phone"
                        value={form.Phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    CCCD
                    <input
                        type="text"
                        name="CCCD"
                        value={form.CCCD}
                        onChange={handleChange}
                    />
                </label>
                <div className="update-profile-actions">
                    <button type="submit" className="update-profile-btn">Lưu thay đổi</button>
                    <button type="button" className="update-profile-btn-outline" onClick={() => navigate("/profile")}>Quay lại</button>
                </div>
            </form>
        </div>
    );
}