import React from "react";
import '../skin_web/SamplingInstructionsPage.css';
import { Link } from 'react-router-dom';

const SamplingInstructionsPage = () => {
    return (
        <div className="sip-container">
            <h1 className="sip-title">HƯỚNG DẪN CÁCH LẤY MẪU XÉT NGHIỆM</h1>
            <p className="sip-intro">
                Trung tâm xét nghiệm <strong>GENLAB VIETNAM</strong> xin chia sẻ đến các bạn cách lấy mẫu xét nghiệm <strong>ADN, NIPT, GEN</strong> chi tiết ngay sau đây:
            </p>
            <div className="sip-section">
                <h2 className="sip-section-title">I. Hướng dẫn cách lấy mẫu Xét nghiệm ADN</h2>
                <div className="sip-sample-block">
                    <h3 className="sip-sample-heading">1. Mẫu thường dùng</h3>
                    <ul className="sip-sample-list">
                        <li><b>Loại mẫu:</b> Niêm mạc miệng và mẫu máu khô.</li>
                        <li><b>Ưu điểm:</b> Thời gian tách chiết ngắn, dùng cho trả kết quả nhanh (4h – 6h).</li>
                        <li><b>Ứng dụng:</b> Dùng được cho xét nghiệm ADN dân sự và hành chính pháp lý.</li>
                    </ul>
                    <div className="sip-img-row-large">

                        <Link to="/niem-mac" className="sip-img-link sip-img-border-blue">
                            <img src="/picture/thu-mau-niem-mac.jpg" alt="Mẫu niêm mạc miệng" className="sip-img-large" />
                            <div className="sip-img-caption">MẪU TẾ BÀO NIÊM MẠC MIỆNG</div>
                        </Link>
                        <Link to="/mau" className="sip-img-link sip-img-border-blue">
                            <img src="/picture/thu-mau-mau.jpg" alt="Mẫu máu khô" className="sip-img-large" />
                            <div className="sip-img-caption">MẪU MÁU KHÔ</div>
                        </Link>
                    </div>
                </div>
                <div className="sip-sample-block">
                    <h3 className="sip-sample-heading">2. Mẫu bí mật</h3>
                    <ul className="sip-sample-list">
                        <li><b>Loại mẫu:</b> Chân tóc, móng tay/chân, cuống rốn.</li>
                        <li><b>Ưu điểm:</b> Dễ thu tại nhà, kín đáo, bảo mật tốt.</li>
                        <li><b>Ứng dụng:</b> Chỉ áp dụng cho xét nghiệm ADN dân sự.</li>
                    </ul>
                    <div className="sip-img-row-large">
                        <Link to="/toc" className="sip-img-link sip-img-border-blue">
                            <img src="/picture/thu-mau-toc.jpg" alt="Mẫu tóc có chân" className="sip-img-large" />
                            <div className="sip-img-caption">MẪU TÓC CÓ CHÂN</div>
                        </Link>
                        <Link to="/mong" className="sip-img-link sip-img-border-blue">
                            <img src="/picture/thu-mau-mong.jpg" alt="Mẫu móng tay/chân" className="sip-img-large" />
                            <div className="sip-img-caption">MẪU MÓNG TAY/CHÂN</div>
                        </Link>
                        <Link to="/ron" className="sip-img-link sip-img-border-blue">
                            <img src="/picture/thu-mau-ron.jpg" alt="Mẫu cuống rốn" className="sip-img-large" />
                            <div className="sip-img-caption">MẪU CUỐNG RỐN</div>
                        </Link>
                    </div>
                </div>
                <div className="sip-sample-block">
                    <h3 className="sip-sample-heading">3. Mẫu đặc biệt</h3>
                    <div className="sip-special-row">
                        <div className="sip-special-desc">
                            <div className="sip-sample-list">
                                <b>Loại mẫu:</b> Tinh trùng, bàn chải đánh răng, kẹo cao su, đầu mẫu thuốc lá.<br />
                                <b>Ưu điểm:</b> Có thể thu thập trong các trường hợp đặc biệt, khó lấy mẫu thông thường.<br />
                                <b>Ứng dụng:</b> Dùng cho các trường hợp cần xác minh ADN khi không có mẫu máu, tóc, móng.
                            </div>
                        </div>
                        <div className="sip-special-imgbox">
                            <Link to="/dac-biet" className="sip-img-link sip-img-border-pink">
                                <img src="/picture/mau-dac-biet.jpg" alt="Mẫu đặc biệt" className="sip-img-special" />
                                <div className="sip-img-caption">MẪU ĐẶC BIỆT</div>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SamplingInstructionsPage;
