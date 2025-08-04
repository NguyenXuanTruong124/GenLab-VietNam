import React from "react";
import "../skin_web/CivilServicePage.css";
import { useNavigate } from "react-router-dom";

const CivilDNAService = () => {
  const navigate = useNavigate();

  return (
    <div className="civil-dna-service-container">
      <h1 className="service-title">Xét Nghiệm DNA Dân Sự</h1>

      <p>
        Xét nghiệm DNA dân sự là dịch vụ xác minh quan hệ huyết thống cho mục
        đích cá nhân hoặc gia đình, không dùng trong pháp lý. Đây là lựa chọn
        phù hợp nếu bạn muốn biết sự thật mà không cần thủ tục hành chính rườm
        rà.
      </p>

      <h2 className="section-title">Đặc điểm nổi bật</h2>
      <ul className="service-list">
        <li>Không cần giấy tờ pháp lý hay xác nhận hành chính.</li>
        <li>Tự lấy mẫu tại nhà hoặc đến trung tâm.</li>
        <li>Kết quả nhanh, chính xác tới 99,9999%.</li>
        <li>Bảo mật thông tin tuyệt đối.</li>
      </ul>

      <h2 className="section-title">Đối tượng sử dụng</h2>
      <img src="/picture/gia-dinh.jpg" alt="Dich-vu" className="dich-vu-img" />
      <ul className="service-list">
        <li>Người muốn xác minh cha – con, mẹ – con, anh – em.</li>
        <li>Gia đình cần làm rõ quan hệ huyết thống.</li>
        <li>Người muốn tìm lại người thân sau thời gian xa cách.</li>
      </ul>

      <h2 className="section-title">Cách lấy mẫu</h2>
      <img src="/picture/kit.jpg" alt="Dich-vu" className="dich-vu-img" />
      <ul className="service-list">
        <li>
          <strong>Tự lấy tại nhà:</strong> Chúng tôi cung cấp bộ kit (niêm mạc
          miệng, tóc, móng…).
        </li>
        <li>
          <strong>Đến trung tâm:</strong> Được hỗ trợ bởi chuyên viên lấy mẫu.
        </li>
      </ul>

      <h2 className="section-title">Chi phí & thời gian</h2>
      <ul className="service-list">
        <li>Thời gian nhận kết quả: 1–5 ngày làm việc (tuỳ gói).</li>
        <li>
          Chi phí: từ 1.500.000 đến 4.000.000 VNĐ (tuỳ mẫu và số lượng người).
        </li>
      </ul>

      <h2 className="section-title">Lưu ý</h2>
      <ul className="service-list">
        <li>Không dùng kết quả cho mục đích pháp lý (khai sinh, tòa án…).</li>
        <li>Chọn trung tâm uy tín để đảm bảo độ chính xác và bảo mật.</li>
        <li>Liên hệ tổng đài GENFAMILY để được tư vấn mẫu phù hợp.</li>
      </ul>

      <div className="cta-section">
        <p>
          Nếu bạn đang băn khoăn về huyết thống, đây là bước đầu tiên để tìm ra
          sự thật.
        </p>
        <button className="more-btn" onClick={() => navigate("/form")}>
          ĐĂNG KÝ NGAY
        </button>
      </div>
    </div>
  );
};

export default CivilDNAService;
