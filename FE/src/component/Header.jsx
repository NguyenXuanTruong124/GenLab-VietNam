import React from 'react';
import '../skin_web/Header.css';
import AccountMenu from './AccountMenu';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <header className="header-wrapper">
            <div className="header-top">
                <div className="header-logo-group">
                    <Link to="/">
                        <img className="header-logo-img" src="/picture/Untitled-1.jpg" alt="GENFAMILY logo" style={{ cursor: 'pointer' }} />
                    </Link>
                    <div className="header-slogan-group">
                        <span className="header-logo-text">GENLAB<span className="header-logo-family">VIETNAM</span></span>
                        <div className="header-slogan">BELIEF CREATES THE ACTUAL FACT - NIỀM TIN CHO HIỆN TẠI</div>
                    </div>
                </div>
            </div>
            <nav className="header-nav">
                <div className="nav-links">
                    <Link to="/" className="nav-link">TRANG CHỦ</Link>
                    <Link to="/about" className="nav-link">GIỚI THIỆU</Link>

                    <div className="nav-link nav-dropdown" onClick={() => navigate("/huong-dan")}>
                        <span className="dropdown-label">HƯỚNG DẪN</span> <span className="dropdown-arrow">▼</span>
                        <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                            <Link to="/mau" className="dropdown-item">Mẫu máu khô</Link>
                            <Link to="/niem-mac" className="dropdown-item">Niêm mạc miệng</Link>
                            <Link to="/toc" className="dropdown-item">Mẫu tóc</Link>
                            <Link to="/mong" className="dropdown-item">Mẫu móng</Link>
                            <Link to="/ron" className="dropdown-item">Mẫu rốn</Link>
                            <Link to="/dac-biet" className="dropdown-item">Mẫu đặc biệt</Link>
                        </div>
                    </div>

                    <div className="nav-link nav-dropdown" onClick={() => navigate("/dich-vu")}>
                        <span className="dropdown-label">DỊCH VỤ</span> <span className="dropdown-arrow">▼</span>
                        <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                            <Link to="/dan-su" className="dropdown-item">Xét nghiệm dân sự</Link>
                            <Link to="/hanh-chinh" className="dropdown-item">Xét nghiệm hành chính</Link>
                            <Link to="/nha" className="dropdown-item">Xét nghiệm tại nhà</Link>
                            <Link to="/gui-mau" className="dropdown-item">Xét nghiệm tự gửi mẫu</Link>
                        </div>
                    </div>
                    <Link to="/price" className="nav-link">BẢNG GIÁ</Link>
                    <Link to="/term" className="nav-link">CHÍNH SÁCH & ĐIỀU KHOẢN</Link>

                    {/* Điều hướng dashboard theo role */}
                    {user && user.role === 'Manager' && (
                        <Link to="/manager" className="nav-link">MANAGER</Link>
                    )}
                    {user && user.role === 'Staff' && (
                        <Link to="/staff" className="nav-link">STAFF</Link>
                    )}
                    {user && user.role === 'Admin' && (
                        <Link to="/admin" className="nav-link">ADMIN</Link>
                    )}
                </div>
                <div className="header-account-menu">
                    {user ? (
                        <AccountMenu user={user} onLogout={() => window.location.reload()} className="header-account-menu" />
                    ) : (
                        <Link to="/signin" className="nav-link nav-login-btn">ĐĂNG NHẬP</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};
export default Header; 