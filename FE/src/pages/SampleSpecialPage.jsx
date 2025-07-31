import React from "react";
import '../skin_web/SampleSpecialPage.css';

const SpecialSampleTest = () => {
    return (
        <div className="specialpage-container">
            <h1 className="specialpage-title">Xét Nghiệm ADN Mẫu Đặc Biệt: Hướng Dẫn Thu Mẫu Ngay Tại Nhà</h1>
            <div className="specialpage-section">
                <div className="specialpage-step-number">1</div>
                <div className="specialpage-section-content">
                    <h2 className="specialpage-section-title">Mẫu ADN Đặc Biệt Là Gì?</h2>
                    <p>Đây là những mẫu sinh học chứa ADN nhưng không phổ biến như máu hay tóc. Những mẫu này thường được thu từ các vật dụng cá nhân có chứa tế bào của người cần xét nghiệm.</p>
                </div>
            </div>
            <div className="specialpage-section">
                <div className="specialpage-step-number">2</div>
                <div className="specialpage-section-content">
                    <h2 className="specialpage-section-title">Các Loại Mẫu ADN Đặc Biệt</h2>
                    <ul>
                        <li>Đầu lọc thuốc lá</li>
                        <li>Bàn chải đánh răng</li>
                        <li>Băng vệ sinh</li>
                        <li>Kẹo cao su đã nhai</li>
                        <li>Tinh trùng (trên khăn giấy, bao cao su,...)</li>
                        <li>Dịch trên quần lót</li>
                    </ul>
                    <p><strong>Lưu ý:</strong> Những mẫu này cần đảm bảo còn dấu vết sinh học rõ ràng và không bị rửa trôi hoặc nhiễm tạp chất.</p>
                </div>
            </div>
            <div className="specialpage-section">
                <div className="specialpage-step-number">3</div>
                <div className="specialpage-section-content">
                    <h2 className="specialpage-section-title">Hướng Dẫn Thu Mẫu Tại Nhà</h2>
                    <ul>
                        <li><strong>Bước 1 – Xác định đúng mẫu:</strong> Mẫu phải là vật đã qua sử dụng của người cần xét nghiệm, chứa ADN như nước bọt, dịch sinh học, tế bào biểu mô,...</li>
                        <li><strong>Bước 2 – Bảo quản:</strong> Gói mẫu bằng giấy trắng sạch, tránh dùng túi nilon vì dễ gây ẩm và mốc.</li>
                        <li><strong>Bước 3 – Ghi chú thông tin:</strong> Ghi rõ ký hiệu phân biệt mẫu (ví dụ: "bàn chải A", "kẹo cao su B") và ngày thu mẫu.</li>
                        <li><strong>Bước 4 – Gửi mẫu:</strong> Gửi đến trung tâm càng sớm càng tốt để đảm bảo chất lượng mẫu.</li>
                    </ul>
                    <p><strong>Riêng mẫu dịch quần lót:</strong> Trung tâm sẽ tư vấn riêng từng trường hợp và báo giá cụ thể.</p>
                </div>
            </div>
            <div className="specialpage-section">
                <div className="specialpage-step-number">4</div>
                <div className="specialpage-section-content">
                    <h2 className="specialpage-section-title">Ưu Điểm Khi Dùng Mẫu Đặc Biệt</h2>
                    <ul>
                        <li>Phù hợp trong trường hợp không thể thu mẫu trực tiếp từ người cần xét nghiệm.</li>
                        <li>Giữ tính bảo mật và kín đáo trong các tình huống tế nhị.</li>
                        <li>Vẫn có thể cho kết quả chính xác nếu mẫu đảm bảo chất lượng.</li>
                    </ul>
                </div>
            </div>
            <div className="specialpage-section">
                <div className="specialpage-step-number">5</div>
                <div className="specialpage-section-content">
                    <h2 className="specialpage-section-title">Kết Luận</h2>
                    <p>Mẫu xét nghiệm ADN đặc biệt là giải pháp linh hoạt trong những tình huống không thể thu mẫu thông thường. Với hướng dẫn thu mẫu đúng cách, bạn hoàn toàn có thể tự thu tại nhà và gửi đến trung tâm để có kết quả xét nghiệm chính xác, bảo mật.</p>
                </div>
            </div>
        </div>
    );
};

export default SpecialSampleTest;
