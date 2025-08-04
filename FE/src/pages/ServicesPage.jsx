import React from "react";
import "../skin_web/ServicesPage.css";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <h1 className="page-title">Dịch Vụ Xét Nghiệm ADN</h1>
      <p className="page-description">
        Chúng tôi mang đến 3 loại hình xét nghiệm chính phù hợp với mọi nhu cầu
        từ cá nhân đến pháp lý.
        <img src="/picture/dich-vu.jpg" alt="Dich-vu" className="dich-vu-img" />
      </p>

      <div className="service-card-list">
        <div className="service-card">
          <h2>Xét Nghiệm ADN Dân Sự</h2>
          <img src="/picture/civil.jpg" alt="Dich-vu" className="dich-vu-img" />
          <p>
            Dành cho mục đích cá nhân hoặc gia đình như xác minh quan hệ huyết
            thống: cha – con, mẹ – con, anh chị em, ông cháu,... Kết quả giúp
            giải tỏa nghi ngờ và làm rõ các mối quan hệ trong gia đình.
          </p>
          <button className="more-btn" onClick={() => navigate("/dan-su")}>
            XEM THÊM
          </button>
        </div>

        <div className="service-card">
          <h2>Xét Nghiệm ADN Gửi Mẫu</h2>
          <img
            src="/picture/home-test.jpg"
            alt="Dich-vu"
            className="dich-vu-img"
          />
          <p>
            Tiện lợi và riêng tư – bạn có thể tự thu mẫu tại nhà bằng tóc, móng
            tay hoặc niêm mạc miệng. Dịch vụ phù hợp cho người ở xa hoặc không
            muốn đến phòng xét nghiệm.
          </p>
          <button className="more-btn" onClick={() => navigate("/gui-mau")}>
            XEM THÊM
          </button>
        </div>

        <div className="service-card">
          <h2>Xét Nghiệm ADN Tại Nhà</h2>
          <img
            src="/picture/xn-nha.jpg"
            alt="Dich-vu"
            className="dich-vu-img"
          />
          <p>
            Tiện lợi và riêng tư – bạn có thể tự thu mẫu tại nhà bằng tóc, móng
            tay hoặc niêm mạc miệng. Dịch vụ phù hợp cho người ở xa hoặc không
            muốn đến phòng xét nghiệm.
          </p>
          <button className="more-btn" onClick={() => navigate("/nha")}>
            XEM THÊM
          </button>
        </div>

        <div className="service-card">
          <h2>Xét Nghiệm ADN Hành Chính</h2>
          <img
            src="/picture/xet-nghiem-adn-hanh-chinh.jpg"
            alt="Dich-vu"
            className="dich-vu-img"
          />
          <p>
            Sử dụng trong các thủ tục pháp lý như nhập tịch, khai sinh, nhận con
            nuôi hoặc thừa kế. Kết quả được cấp theo mẫu chuẩn, có giá trị pháp
            lý và được chấp nhận bởi cơ quan nhà nước.
          </p>
          <button className="more-btn" onClick={() => navigate("/hanh-chinh")}>
            XEM THÊM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
