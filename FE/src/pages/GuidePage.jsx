import React from 'react';
import '../skin_web/GuidePage.css';

export default function GuidePage() {
    return (
        <div className="guidepage-container">
            <h1 className="guide-title">HƯỚNG DẪN CÁCH LẤY MẪU XÉT NGHIỆM</h1>
            <section className="guide-section">
                <h2>I. Hướng dẫn cách lấy mẫu Xét nghiệm ADN</h2>
                <div className="guide-sample-groups">
                    {/* Mẫu thường dùng */}
                    <div className="guide-sample-group">
                        <div className="guide-sample-icon">
                            <img src="/picture/mau-niem-mac-mieng.png" alt="Niêm mạc miệng" />
                        </div>
                        <div className="guide-sample-content">
                            <h3>Mẫu thường dùng</h3>
                            <ul>
                                <li><b>Loại mẫu:</b> Niêm mạc miệng và mẫu máu khô.</li>
                                <li><b>Ưu điểm:</b> Thời gian tách chiết ngắn, dùng cho trả kết quả nhanh (4h – 6h).</li>
                                <li><b>Ứng dụng:</b> Xét nghiệm ADN dân sự và hành chính pháp lý.</li>
                            </ul>
                        </div>
                    </div>
                    {/* Mẫu bí mật */}
                    <div className="guide-sample-group">
                        <div className="guide-sample-icon">
                            <img src="/picture/toc-co-chan.png" alt="Tóc có chân" />
                        </div>
                        <div className="guide-sample-content">
                            <h3>Mẫu bí mật</h3>
                            <ul>
                                <li><b>Loại mẫu:</b> Chân tóc, móng tay/chân, cuống rốn.</li>
                                <li><b>Ưu điểm:</b> Dễ thu tại nhà, bí mật, ít ai để ý.</li>
                                <li><b>Ứng dụng:</b> Chỉ áp dụng cho xét nghiệm ADN dân sự.</li>
                            </ul>
                        </div>
                    </div>
                    {/* Mẫu đặc biệt */}
                    <div className="guide-sample-group">
                        <div className="guide-sample-icon">
                            <img src="/picture/ban-chai-danh-rang.png" alt="Mẫu đặc biệt" />
                        </div>
                        <div className="guide-sample-content">
                            <h3>Mẫu đặc biệt</h3>
                            <ul>
                                <li><b>Loại mẫu:</b> Tinh trùng, bàn chải đánh răng, kẹo cao su, đầu lọc thuốc lá.</li>
                                <li><b>Ưu điểm:</b> Dùng khi không thể lấy các mẫu khác.</li>
                                <li><b>Ứng dụng:</b> Chỉ áp dụng cho xét nghiệm ADN dân sự.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="guide-section">
                <h2>II. Hướng dẫn cách lấy mẫu Xét nghiệm NIPT</h2>
                <div className="guide-nipt-box">
                    <p>Liên hệ trung tâm để được hướng dẫn chi tiết về lấy mẫu xét nghiệm NIPT phù hợp với từng trường hợp.</p>
                </div>
            </section>
            <div className="guide-contact-box">
                <h3>Liên hệ tư vấn</h3>
                <p>Hotline: <a href="tel:0877799944">08.777.999.44</a></p>
                <p>Email: <a href="mailto:info@trungtamxetnghiem.vn">info@trungtamxetnghiem.vn</a></p>
                <p>Website: <a href="https://trungtamxetnghiem.vn/huong-dan-thu-mau/" target="_blank" rel="noopener noreferrer">Hướng dẫn thu mẫu GenFamily</a></p>
            </div>
        </div>
    );
}
