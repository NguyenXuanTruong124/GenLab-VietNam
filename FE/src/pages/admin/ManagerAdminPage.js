import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../skin_web/admin/ManagerAccountPage.css";
import AccountMenu from "../../component/AccountMenu";
import { Link, Outlet } from "react-router-dom";

export default function ManagerPage() {
  // Lấy user từ localStorage hoặc context
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="manager-dashboard">
      <header className="manager-header-redesign">
        <div className="manager-header-flex">
          <div className="manager-header-left">
            <Link to="/">
              <img
                className="manager-logo-img"
                src="/picture/Untitled-1.jpg"
                alt="GENFAMILY logo"
              />
            </Link>
            <div className="manager-header-slogan">
              <span className="manager-logo-text">
                GENLAB<span className="manager-logo-family">VIETNAM</span>
              </span>
              <span className="manager-slogan">
                BELIEF CREATES THE ACTUAL FACT - NIỀM TIN CHO HIỆN TẠI
              </span>
            </div>
          </div>
          <div className="manager-header-center">
            <span className="manager-title">Admin Dashboard</span>
          </div>
          <div className="manager-header-right">
            {user ? (
              <AccountMenu
                user={user}
                onLogout={() => window.location.reload()}
              />
            ) : (
              <Link to="/signin" className="nav-link nav-login-btn">
                ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>
        <nav className="manager-nav-redesign">
          <Link to="/admin/account" className="manager-btn">
            Quản lý tài khoản
          </Link>

          <Link to="/admin/service" className="manager-btn">
            Quản lý Dịch vụ & Giá
          </Link>
        </nav>
      </header>
      <main className="manager-main">
        <Outlet /> {/* 👉 Hiển thị nội dung tương ứng với route con */}
      </main>
    </div>
  );
}
