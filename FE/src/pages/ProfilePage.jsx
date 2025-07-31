import React, { useEffect, useState } from "react";
import axios from "axios";
import "../skin_web/ProfilePage.css";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || user?.AccountID;
        const res = await axios.get(
          `http://localhost:3001/api/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return <div className="profile-loading">Đang tải thông tin...</div>;
  if (!profile)
    return <div className="profile-error">Không thể tải thông tin hồ sơ.</div>;

  const { account, information } = profile;
  // Avatar mặc định nếu không có
  const avatarUrl =
    account?.avatar && account.avatar.trim() !== ""
      ? account.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          account?.UserName || "U"
        )}&background=0099ff&color=fff&size=128`;
  const roleLabel = account?.Role === "Customer" ? "Khách hàng" : account?.Role;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={avatarUrl} alt="avatar" />
          <span className="profile-badge">{roleLabel}</span>
        </div>
      </div>
      <div className="profile-info">
        <h2>{account?.UserName}</h2>
        <div className="profile-role">{account?.Role}</div>
        <p>
          <b>Email:</b> {account?.Email}
        </p>
        <p>
          <b>Trạng thái:</b> {account?.Status === "ON" ? "Hoạt động" : "Khóa"}
        </p>
        <hr />
        <div className="profile-details">
          <p>
            <b>Họ tên:</b> <span>{information?.Name_Information}</span>
          </p>
          <p>
            <b>Giới tính:</b> <span>{information?.Gender}</span>
          </p>
          <p>
            <b>Ngày sinh:</b> <span>{information?.Date_Of_Birth}</span>
          </p>
          <p>
            <b>Địa chỉ:</b> <span>{information?.Address}</span>
          </p>
          <p>
            <b>Số điện thoại:</b> <span>{information?.Phone}</span>
          </p>
          <p>
            <b>CCCD:</b> <span>{information?.CCCD}</span>
          </p>
        </div>
      </div>
      <div className="profile-actions">
        <button
          className="profile-btn"
          onClick={() => navigate("/update-profile")}
        >
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
}
