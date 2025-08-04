import React from "react";
import "../skin_web/AdminstrativeServicePage.css";
import { useNavigate } from "react-router-dom";

const AdministrativeDNA = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dna-service-container">
      <h1 className="service-title">Xét Nghiệm ADN Hành Chính</h1>

      <p>
        Xét nghiệm ADN hành chính là dịch vụ dùng để phục vụ các mục đích pháp
        lý như làm khai sinh, nhập quốc tịch, di trú, hoặc các thủ tục kiện tụng
        liên quan đến huyết thống. Kết quả có giá trị pháp lý, cần thực hiện tại
        trung tâm được cấp phép và theo đúng quy trình hành chính.
      </p>

      <h2 className="section-title">Đặc điểm nổi bật</h2>
      <ul className="service-list">
        <li>Kết quả có giá trị trước pháp luật.</li>
        <li>Yêu cầu giấy tờ tùy thân và xác thực danh tính.</li>
        <li>
          Phải lấy mẫu trực tiếp tại trung tâm hoặc trước người có thẩm quyền.
        </li>
        <li>Mẫu phổ biến: niêm mạc miệng (dùng que lấy mẫu chuyên dụng).</li>
      </ul>

      <h2 className="section-title">Đối tượng phù hợp</h2>
      <img src="/picture/gia-dinh.jpg" alt="Dich-vu" className="dich-vu-img" />
      <ul className="service-list">
        <li>Cha/mẹ làm khai sinh cho con.</li>
        <li>Người làm thủ tục nhận con, nhập quốc tịch, visa.</li>
        <li>Tranh chấp dân sự cần chứng minh quan hệ huyết thống.</li>
        <li>Hỗ trợ tố tụng trong các vụ kiện về nhân thân.</li>
      </ul>

      <h2 className="section-title">Quy trình lấy mẫu</h2>
      <p>
        Mẫu ADN hành chính phải được lấy tại trung tâm xét nghiệm hoặc trước sự
        chứng kiến của cán bộ tư pháp. Các bên tham gia cần mang đầy đủ giấy tờ
        tùy thân và ký tên xác nhận khi lấy mẫu.
      </p>

      <h2 className="section-title">Chi phí và thời gian</h2>
      <ul className="service-list">
        <li>
          Chi phí: Từ 3.000.000 VNĐ – 6.000.000 VNĐ tuỳ số lượng mẫu và mục đích
          pháp lý.
        </li>
        <li>
          Thời gian trả kết quả: 3–7 ngày làm việc, có gói khẩn từ 24h – 48h.
        </li>
      </ul>

      <h2 className="section-title">Lưu ý quan trọng</h2>
      <img src="/picture/giay-to.jpg" alt="Dich-vu" className="dich-vu-img" />
      <ul className="service-list">
        <li>
          Phải có giấy tờ tùy thân hợp lệ của người tham gia (CMND/CCCD, hộ
          khẩu, khai sinh…).
        </li>
        <li>
          Chỉ thực hiện tại các trung tâm được cấp phép xét nghiệm ADN phục vụ
          hành chính.
        </li>
        <li>
          Kết quả được đóng dấu pháp lý, chữ ký, có thể sử dụng trong hồ sơ hành
          chính và pháp luật.
        </li>
      </ul>

      <div className="cta-section">
        <p>
          Nếu bạn đang cần sử dụng kết quả ADN cho mục đích pháp lý, hãy liên hệ
          chúng tôi ngay hôm nay để được hỗ trợ đầy đủ quy trình và giấy tờ.
        </p>
        <button className="more-btn" onClick={() => navigate("/form")}>
          ĐĂNG KÍ
        </button>
      </div>
    </div>
  );
};

export default AdministrativeDNA;
