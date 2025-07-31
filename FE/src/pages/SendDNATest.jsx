import React from "react";
import { useNavigate } from "react-router-dom";

const HomeDNAService = () => {
  const navigate = useNavigate();

  return (
    <div className="home-dna-service-container">
      <h1 className="service-title">
        Tự Xét Nghiệm ADN Ngay Tại Nhà – Dễ Dàng, Kín Đáo
      </h1>

      <p>
        Bạn hoàn toàn có thể tự lấy mẫu ADN tại nhà mà không cần đến phòng khám
        hay trung tâm y tế. Với bộ dụng cụ được gửi tận nơi và hướng dẫn chi
        tiết, bạn có thể thực hiện lấy mẫu một cách đơn giản, nhanh chóng và an
        toàn. Giải pháp lý tưởng cho những ai cần sự riêng tư, linh hoạt và
        chính xác.
      </p>

      <h2 className="section-title">Tự lấy mẫu có dễ không?</h2>
      <img src="/picture/gui-mau.jpg" alt="Dich-vu" className="dich-vu-img" />
      <ul className="service-list">
        <li>
          <strong>Rất tiện lợi:</strong> Tự lấy mẫu bất kỳ lúc nào phù hợp với
          bạn – không cần đi lại hay chờ đợi.
        </li>
        <li>
          <strong>Riêng tư tuyệt đối:</strong> Không cần gặp nhân viên y tế hay
          đến cơ sở công cộng – mọi thông tin được bảo mật.
        </li>
        <li>
          <strong>Độ chính xác cao:</strong> Mẫu tại nhà được xử lý và phân tích
          giống như mẫu thu tại phòng xét nghiệm chuyên nghiệp.
        </li>
      </ul>

      <h2 className="section-title">Hướng dẫn quy trình tự lấy mẫu tại nhà</h2>
      <ol className="service-steps">
        <li>
          <strong>Bước 1:</strong> Đăng ký dịch vụ và cung cấp địa chỉ nhận bộ
          dụng cụ lấy mẫu.
        </li>
        <li>
          <strong>Bước 2:</strong> Nhận bộ kit gồm: tăm bông lấy mẫu, hướng dẫn
          chi tiết, phong bì đựng mẫu.
        </li>
        <li>
          <strong>Bước 3:</strong> Thực hiện lấy mẫu niêm mạc miệng theo hướng
          dẫn (không đau, dễ thực hiện).
        </li>
        <li>
          <strong>Bước 4:</strong> Đóng gói và gửi lại mẫu qua bưu điện hoặc
          dịch vụ chuyển phát nhanh.
        </li>
        <li>
          <strong>Bước 5:</strong> Nhận kết quả qua email, Zalo hoặc bản in theo
          yêu cầu.
        </li>
      </ol>

      <h2 className="section-title">
        Ai nên sử dụng dịch vụ tự lấy mẫu tại nhà?
      </h2>
      <ul className="service-list">
        <li>Người không tiện di chuyển đến trung tâm xét nghiệm.</li>
        <li>Khách hàng ở khu vực xa, không có phòng xét nghiệm gần nơi ở.</li>
        <li>
          Gia đình có người già, trẻ nhỏ hoặc người bệnh cần hạn chế tiếp xúc
          nơi đông người.
        </li>
      </ul>

      <h2 className="section-title">Chi phí & thời gian trả kết quả</h2>
      <p>
        Chi phí cho xét nghiệm tại nhà dao động từ{" "}
        <strong>1.700.000 – 4.000.000 VNĐ</strong>, tùy loại xét nghiệm và số
        lượng người tham gia. Thời gian trả kết quả từ{" "}
        <strong>3 – 7 ngày làm việc</strong> sau khi chúng tôi nhận được mẫu.
      </p>

      <h2 className="section-title">Cách đăng ký dịch vụ</h2>
      <p>
        Bạn có thể đăng ký nhanh chóng qua website hoặc liên hệ hotline để được
        hỗ trợ. Chúng tôi sẽ đồng hành cùng bạn trong suốt quá trình – từ khi
        đăng ký, lấy mẫu đến khi nhận kết quả.
      </p>

      <div className="cta-section">
        <button className="more-btn" onClick={() => navigate("/form")}>
          ĐĂNG KÝ NGAY
        </button>
      </div>
    </div>
  );
};

export default HomeDNAService;
