import React from 'react';
import '../skin_web/SampleMucosaPage.css';

const Mucosa = () => {
    return (
        <div className="mucosa-container">
            <h1 className="mucosa-title">Xét Nghiệm ADN Bằng Niêm Mạc Miệng: Đơn Giản, Chính Xác, Dễ Thực Hiện</h1>
            <div className="mucosa-section">
                <div className="mucosa-step-number">1</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Xét Nghiệm ADN Bằng Niêm Mạc Miệng Là Gì?</h2>
                    <p>Bạn đang băn khoăn về quan hệ huyết thống trong gia đình? Một xét nghiệm ADN bằng niêm mạc miệng có thể là câu trả lời. Đây là phương pháp đơn giản, không xâm lấn, phù hợp với mọi lứa tuổi – từ trẻ sơ sinh đến người lớn – giúp xác minh các mối quan hệ như cha con, anh em, họ hàng với độ chính xác cao.</p>
                    <p>Xét nghiệm này sử dụng mẫu ADN lấy từ tế bào bên trong má bằng que tăm bông chuyên dụng. Không cần dùng máu, không đau, không cần kim tiêm. Độ chính xác có thể lên đến 99,9999%.</p>
                </div>
            </div>
            <div className="mucosa-section">
                <div className="mucosa-step-number">2</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Quy Trình Thực Hiện</h2>
                    <ul>
                        <li><strong>Chuẩn bị dụng cụ:</strong> Que tăm bông sạch, bao bì bảo quản, mẫu hướng dẫn.</li>
                        <li><strong>Lấy mẫu:</strong> Dùng que chà nhẹ vào bên trong má khoảng 30 giây.</li>
                        <li><strong>Bảo quản & gửi mẫu:</strong> Đóng gói đúng cách, gửi đến phòng xét nghiệm.</li>
                        <li><strong>Nhận kết quả:</strong> Sau 3–7 ngày, hoặc nhanh hơn tùy theo gói dịch vụ.</li>
                    </ul>
                    <p className="mucosa-warning"><strong>Lưu ý:</strong> Không ăn, uống, hút thuốc ít nhất 30 phút trước khi lấy mẫu. Trẻ em nên uống nước ấm sau khi bú sữa để làm sạch khoang miệng.</p>
                    <img src="/picture/lay-mau-mieng.png" alt="Xét nghiệm ADN là gì" className="mucosa-img" />
                </div>
            </div>
            <div className="mucosa-section">
                <div className="mucosa-step-number">3</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Lợi Ích Của Phương Pháp Này</h2>
                    <ul>
                        <li><strong>Giải tỏa tâm lý:</strong> Loại bỏ nghi ngờ về huyết thống.</li>
                        <li><strong>Tiện lợi:</strong> Có thể tự lấy mẫu tại nhà.</li>
                        <li><strong>Kín đáo:</strong> Không cần đến cơ sở y tế.</li>
                        <li><strong>Tiết kiệm:</strong> Chi phí thấp hơn so với các phương pháp khác.</li>
                    </ul>
                    <img src="/picture/gia-dinh.jpg" alt="Xét nghiệm ADN là gì" className="mucosa-img" />
                </div>
            </div>
            <div className="mucosa-section">
                <div className="mucosa-step-number">4</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Ai Nên Xét Nghiệm Bằng Niêm Mạc Miệng?</h2>
                    <ul>
                        <li>Người nghi ngờ quan hệ cha con, mẹ con, anh chị em.</li>
                        <li>Gia đình tìm kiếm người thân thất lạc.</li>
                        <li>Cá nhân cần xác minh huyết thống vì lý do pháp lý hoặc riêng tư.</li>
                    </ul>
                </div>
            </div>
            <div className="mucosa-section">
                <div className="mucosa-step-number">5</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Cần Lưu Ý Điều Gì?</h2>
                    <ul>
                        <li>Kết quả có thể ảnh hưởng lớn đến tâm lý và quan hệ gia đình.</li>
                        <li>Nên chọn trung tâm xét nghiệm được cấp phép để đảm bảo độ tin cậy.</li>
                        <li>Nếu dùng cho mục đích pháp lý, cần kiểm tra trước yêu cầu của cơ quan chức năng.</li>
                    </ul>
                </div>
            </div>
            <div className="mucosa-section">
                <div className="mucosa-step-number">6</div>
                <div className="mucosa-section-content">
                    <h2 className="mucosa-section-title">Kết Luận</h2>
                    <p>Xét nghiệm ADN bằng niêm mạc miệng là phương pháp đơn giản, an toàn, chính xác và dễ tiếp cận. Đây là công cụ hữu hiệu giúp bạn tìm ra sự thật, mang lại sự rõ ràng và bình yên trong các mối quan hệ cá nhân.</p>
                </div>
            </div>
        </div>
    );
};

export default Mucosa;
