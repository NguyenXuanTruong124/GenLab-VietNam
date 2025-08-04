import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../skin_web/ResetPassword.css";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: otp+new password

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        // Clear message when user starts typing
        if (msg) setMsg("");
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg("");

        if (!data.email) {
            setMsg("Vui lòng nhập email của bạn");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/auth/send-reset-otp", {
                email: data.email
            });
            setMsg(res.data.message || "Mã OTP đã được gửi đến email của bạn");
            setStep(2);
        } catch (err) {
            setMsg(err.response?.data?.message || "Gửi OTP thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg("");

        if (!data.otp || !data.newPassword || !data.confirmPassword) {
            setMsg("Vui lòng nhập đầy đủ thông tin");
            setIsLoading(false);
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            setMsg("Mật khẩu xác nhận không khớp");
            setIsLoading(false);
            return;
        }

        if (data.newPassword.length < 6) {
            setMsg("Mật khẩu phải có ít nhất 6 ký tự");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/auth/reset-password", {
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword
            });
            setMsg(res.data.message || "Đặt lại mật khẩu thành công!");
            setTimeout(() => {
                navigate("/signin");
            }, 2000);
        } catch (err) {
            setMsg(err.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const getMessageClass = () => {
        if (msg.includes("thành công") || msg.includes("đã được gửi")) {
            return "success-message";
        }
        return "error-message";
    };

    return (
        <div className="reset-password-container">
            <h2>Đặt lại mật khẩu</h2>

            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : 'pending'}`}>1</div>
                <div className={`step-line ${step >= 2 ? 'completed' : ''}`}></div>
                <div className={`step ${step >= 2 ? 'active' : 'pending'}`}>2</div>
            </div>

            {msg && <div className={`message ${getMessageClass()}`}>{msg}</div>}

            {/* Step 1: Email */}
            {step === 1 && (
                <form onSubmit={handleSendOTP} className="reset-password-form">
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </label>
                    <button type="submit" disabled={isLoading}>
                        {isLoading && <span className="loading"></span>}
                        {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                    </button>
                </form>
            )}

            {/* Step 2: OTP + New Password */}
            {step === 2 && (
                <form onSubmit={handleResetPassword} className="reset-password-form">
                    <label>
                        Mã OTP
                        <input
                            type="text"
                            name="otp"
                            value={data.otp}
                            onChange={handleChange}
                            placeholder="Nhập mã OTP 6 số"
                            maxLength="6"
                            className="otp-input"
                            required
                        />
                    </label>
                    <label>
                        Mật khẩu mới
                        <input
                            type="password"
                            name="newPassword"
                            value={data.newPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            minLength="6"
                            required
                        />
                    </label>
                    <label>
                        Xác nhận mật khẩu
                        <input
                            type="password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                            minLength="6"
                            required
                        />
                    </label>
                    <button type="submit" disabled={isLoading}>
                        {isLoading && <span className="loading"></span>}
                        {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                    </button>
                </form>
            )}

            <div className="back-to-login">
                <Link to="/signin">← Quay lại đăng nhập</Link>
            </div>
        </div>
    );
}
