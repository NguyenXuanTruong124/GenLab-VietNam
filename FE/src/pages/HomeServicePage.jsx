import React from 'react';
import '../skin_web/HomeServicePage.css';
import { useNavigate } from 'react-router-dom';

const HomeDNAService = () => {
    const navigate = useNavigate();

    return (
        <div className="home-dna-service-container">
            <h1 className="service-title">Xét Nghiệm ADN Tại Nhà - Đơn Giản, Kín Đáo, Chính Xác</h1>

            <p>
                Xét nghiệm ADN tại nhà là lựa chọn lý tưởng cho những ai cần sự riêng tư, tiện lợi và vẫn đảm bảo độ chính xác cao.
                Với bộ dụng cụ lấy mẫu được gửi tận nơi, bạn có thể tự thu mẫu và gửi lại phòng xét nghiệm mà không cần đến trung tâm.
            </p>

            <h2 className="section-title">Lợi ích của xét nghiệm tại nhà</h2>
            <img src="/picture/xn-nha.jpg" alt="Dich-vu" className="dich-vu-img" />
            <ul className="service-list">
                <li><strong>Tiện lợi:</strong> Tự lấy mẫu bất kỳ lúc nào, không cần đặt lịch hẹn.</li>
                <li><strong>Kín đáo:</strong> Đảm bảo quyền riêng tư, phù hợp với trường hợp nhạy cảm.</li>
                <li><strong>Chính xác:</strong> Kết quả tương đương khi làm tại trung tâm.</li>
            </ul>

            <h2 className="section-title">Quy trình thực hiện</h2>
            <ol className="service-steps">
                <li><strong>Bước 1:</strong> Đăng ký dịch vụ và cung cấp thông tin nhận bộ kit.</li>
                <li><strong>Bước 2:</strong> Nhận bộ lấy mẫu gồm: tăm bông, hướng dẫn, phong bì đựng mẫu.</li>
                <li><strong>Bước 3:</strong> Lấy mẫu niêm mạc miệng theo hướng dẫn.</li>
                <li><strong>Bước 4:</strong> Gửi mẫu về trung tâm.</li>
                <li><strong>Bước 5:</strong> Nhận kết quả qua email, Zalo hoặc trực tiếp.</li>
            </ol>

            <h2 className="section-title">Đối tượng nên sử dụng</h2>
            <ul className="service-list">
                <li>Người cần xác minh huyết thống nhưng không tiện đến trung tâm.</li>
                <li>Khách hàng ở tỉnh xa, vùng sâu vùng xa.</li>
                <li>Gia đình có trẻ nhỏ, người cao tuổi cần xét nghiệm.</li>
            </ul>

            <h2 className="section-title">Chi phí và thời gian</h2>
            <p>
                Chi phí xét nghiệm tại nhà dao động từ <strong>2.800.000 – 5.000.000 VNĐ</strong> tuỳ loại xét nghiệm, số mẫu và gói dịch vụ.
                Thời gian trả kết quả thường từ <strong>3–7 ngày làm việc</strong>.
            </p>

            <h2 className="section-title">Liên hệ đăng ký</h2>
            <p>
                Đăng ký ngay trên website hoặc liên hệ hotline để được tư vấn và hỗ trợ đầy đủ quy trình. Chúng tôi luôn đồng hành cùng bạn từ lúc lấy mẫu đến khi có kết quả.
            </p>

            <p><em>Lưu ý:</em> Đọc kỹ <a href="/huong-dan" style={{ color: '#0077cc', textDecoration: 'underline' }}>hướng dẫn</a> trước khi lấy mẫu để đảm bảo kết quả chính xác nhất.</p>

            <div className="cta-section">
                <button className="more-btn" onClick={() => navigate('/home-sampling')}>ĐĂNG KÍ NGAY</button>
            </div>
        </div>
    );
};

export default HomeDNAService;
