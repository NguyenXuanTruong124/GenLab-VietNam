import React from "react";
import { useNavigate } from "react-router-dom";
import "../skin_web/HomePage.css";
import ChatAI from "../component/ChatAI";
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Banner đầu trang */}
      <section className="banner-section">
        <img
          className="banner-img"
          src="/picture/Blue and White Modern Lab Testing Services Banner.png"
          alt="Lab Testing Services Banner"
        />
      </section>

      {/* Giới thiệu trung tâm - Về chúng tôi */}
      <section className="about-section about-section-custom">
        <div className="about-img-col">
          <img
            className="about-main-img"
            src="/picture/nu-nhan-vien-trung-tam-xet-nghiem-adn-GENFAMILY-cover.jpg"
            alt="Nhân viên trung tâm"
          />
        </div>
        <div className="about-content-col">
          <div className="about-title-group">
            <span className="about-label">VỀ CHÚNG TÔI</span>
            <h2>TRUNG TÂM XÉT NGHIỆM GENLAB VIETNAM</h2>
          </div>
          <div className="about-boxes-custom">
            <div className="about-box-custom">
              <img src="/picture/icon-genfamily-small.png" alt="icon" />
              Hệ thống phòng xét nghiệm và quy trình chuẩn Quốc tế, GENLAB
              VIETNAM cam kết độ chính xác tuyệt đối 99,99%.
            </div>
            <div className="about-box-custom">
              <img src="/picture/icon-genfamily-small.png" alt="icon" />
              Đạt chứng nhận ISO 13485 – Tiêu chuẩn Quốc Tế về xét nghiệm ADN
              duy nhất tại Việt Nam.
            </div>
            <div className="about-box-custom">
              <img src="/picture/icon-genfamily-small.png" alt="icon" />
              Hỗ trợ thu mẫu tận nơi MIỄN PHÍ (Kể cả ngoài giờ hành chính) – áp
              dụng toàn quốc.
            </div>
            <div className="about-box-custom">
              <img src="/picture/icon-genfamily-small.png" alt="icon" />
              Trả kết quả nhanh chỉ sau 6 giờ. Gửi trực tiếp cho người đăng ký,
              cam kết bảo mật thông tin 100%.
            </div>
            <div className="about-box-custom">
              <img src="/picture/icon-genfamily-small.png" alt="icon" />
              Là đơn vị DUY NHẤT trên thị trường làm xét nghiệm lần 2 hoàn toàn
              MIỄN PHÍ.
            </div>
          </div>
        </div>
      </section>

      {/* Bảng giá dịch vụ */}
      <section className="pricing-section">
        <h2> ĐĂNG KÍ NGAY </h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="price">1.700.000đ</div>
            <div className="old-price">1.999.000đ/mẫu</div>
            <div className="title">GÓI XÉT NGHIỆM ADN GỬI TỪ NHÀ</div>
            <div className="desc">
              "Là xét nghiệm ADN dân sự, tự nguyện với mục đích giải tỏa nghi
              ngờ, xác định mối quan hệ giữa các cá nhân"
            </div>
            <ul>
              <li>Trả kết quả sau 2 - 3 ngày.</li>
              <li>Chính xác 99,99999998%.</li>
              <li className="fail">Không dùng cho mục đích pháp lý.</li>
              <li>Thủ tục đơn giản / dễ thực hiện.</li>
              <li>Thu mẫu tại trung tâm.</li>
              <li>Bảo mật bằng hệ thống mã vạch.</li>
              <li>Thanh toán tiện lợi.</li>
              <li>Bảo hiểm kết quả giá trị cao.</li>
              <li>Tổng đài hỗ trợ 24/7.</li>
            </ul>
            <button
              className="more-btn"
              onClick={() =>
                navigate("/form", { state: { formType: "SendSampling" } })
              }
            >
              ĐĂNG KÍ
            </button>
          </div>

          <div className="pricing-card">
            <div className="price">1.500.000đ</div>
            <div className="old-price">2.499.000đ/mẫu</div>
            <div className="title">
              GÓI XÉT NGHIỆM ADN DÂN SỰ TẠI CƠ SỞ Y TẾ
            </div>
            <div className="desc">
              "Được bảo hộ về mặt pháp lý trong các thủ tục hành chính: nhận cha
              con, giấy khai sinh, nhập tịch, thừa kế, cấp visa,..."
            </div>
            <ul>
              <li>Trả kết quả sau 2 - 3 ngày.</li>
              <li>Chính xác 99,99999998%.</li>
              <li>Có giá trị pháp lý (dùng mãi mãi).</li>
              <li>Thủ tục đơn giản / dễ thực hiện.</li>
              <li>Thu mẫu tại trung tâm.</li>
              <li>Bảo mật bằng hệ thống mã vạch.</li>
              <li>Thanh toán tiện lợi.</li>
              <li>Bảo hiểm kết quả giá trị cao.</li>
              <li>Tổng đài hỗ trợ 24/7.</li>
            </ul>
            <button
              className="more-btn"
              onClick={() =>
                navigate("/form", { state: { formType: "MedicalFacility" } })
              }
            >
              ĐĂNG KÍ
            </button>
          </div>

          <div className="pricing-card">
            <div className="price">2.000.000đ</div>
            <div className="old-price">3.999.000đ/gói</div>
            <div className="title">GÓI XÉT NGHIỆM ADN TẠI NHÀ</div>
            <div className="desc">
              "Giúp xác định được mối quan hệ cha con từ khi còn trong bụng mẹ,
              không xâm lấn nên rất an toàn cho mẹ bầu"
            </div>
            <ul>
              <li>Trả kết quả sau 5 - 7 ngày.</li>
              <li>Chính xác &gt;99,9999%.</li>
              <li>Thủ tục đơn giản / dễ thực hiện.</li>
              <li>Thu mẫu tại nhà / trung tâm.</li>
              <li>Bảo mật bằng hệ thống mã vạch.</li>
              <li>Thanh toán tiện lợi.</li>
              <li>Bảo hiểm kết quả giá trị cao.</li>
              <li>Tổng đài hỗ trợ 24/7.</li>
              <li>Được hỗ trợ thu mẫu tại nhà.</li>
            </ul>
            <button
              className="more-btn"
              onClick={() =>
                navigate("/form", { state: { formType: "HomeSampling" } })
              }
            >
              ĐĂNG KÍ
            </button>
          </div>

          <div className="pricing-card">
            <div className="price">3.000.000đ</div>
            <div className="old-price">5.999.000đ/gói</div>
            <div className="title">GÓI XÉT NGHIỆM ADN HÀNH CHÍNH</div>
            <div className="desc">
              "Giúp xác định được mối quan hệ cha con từ khi còn trong bụng mẹ,
              không xâm lấn nên rất an toàn cho mẹ bầu"
            </div>
            <ul>
              <li>Trả kết quả sau 5 - 7 ngày.</li>
              <li>Chính xác &gt;99,9999%.</li>
              <li>Thủ tục đơn giản / dễ thực hiện.</li>
              <li>Thu mẫu tại nhà / trung tâm.</li>
              <li>Bảo mật bằng hệ thống mã vạch.</li>
              <li>Thanh toán tiện lợi.</li>
              <li>Bảo hiểm kết quả giá trị cao.</li>
              <li>Tổng đài hỗ trợ 24/7.</li>
              <li>Được hỗ trợ thu mẫu tại nhà.</li>
            </ul>
            <button
              className="more-btn"
              onClick={() =>
                navigate("/form", { state: { formType: "AdminFacility" } })
              }
            >
              ĐĂNG KÍ
            </button>
          </div>
          <div className="pricing-card">
            <div className="price">FREE</div>
            <div className="title">DỊCH VỤ XÉT NGHIỆM ADN</div>
            <div className="desc">
              “Đăng ký để được hỗ trợ nhanh chóng và lựa chọn gói xét nghiệm phù
              hợp nhất với bạn.”
            </div>
            <ul>
              <li>Xét nghiệm dân sự, pháp lý, trước sinh, huyết thống,...</li>
              <li>Trả kết quả nhanh chóng, chính xác đến 99,999999%.</li>
              <li>Thu mẫu tại nhà hoặc tại trung tâm.</li>
              <li>Bảo mật thông tin bằng hệ thống mã vạch.</li>
              <li>Tư vấn miễn phí 24/7.</li>
              <li>Thanh toán linh hoạt – thuận tiện.</li>
            </ul>
            <button
              className="more-btn"
              onClick={() => navigate("/form", { state: { formType: "Free" } })}
            >
              ĐĂNG KÍ
            </button>
          </div>
        </div>
      </section>

      {/* Loại mẫu xét nghiệm */}
      <section className="sample-section">
        <div className="sample-title-main">LOẠI MẪU CẦN THU</div>
        <h2>LÀM XÉT NGHIỆM ADN HUYẾT THỐNG</h2>
        <p className="sample-desc">
          Dưới đây là các mẫu sinh học thường sử dụng làm ADN xét nghiệm cho mục
          đích Dân sự / Pháp Lý, được chia thành 2 loại như sau:
        </p>
        <div className="sample-types-2col">
          {/* MẪU THÔNG THƯỜNG */}
          <div className="sample-group-2col">
            <div className="sample-label-2col">MẪU THÔNG THƯỜNG</div>
            <div className="sample-group-desc">
              Áp dụng cho mục đích Dân sự / Pháp Lý.
            </div>
            <div className="sample-list-2col">
              <div className="sample-item-2col">
                <img src="/picture/mau-mau.png" alt="Máu khô" />
                <span>Máu khô</span>
              </div>
              <div className="sample-item-2col">
                <img
                  src="/picture/mau-niem-mac-mieng.png"
                  alt="Niêm mạc miệng"
                />
                <span>Niêm mạc miệng</span>
              </div>
            </div>
          </div>
          {/* MẪU ĐẶC BIỆT */}
          <div className="sample-group-2col special">
            <div className="sample-label-2col">MẪU ĐẶC BIỆT</div>
            <div className="sample-group-desc">
              Áp dụng cho mục đích Dân sự.
            </div>
            <div className="sample-list-2col">
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div className="sample-item-2col">
                  <img src="/picture/toc-co-chan.png" alt="Tóc có chân" />
                  <span>Tóc có chân</span>
                </div>
                <div className="sample-item-2col">
                  <img src="/picture/mong-tay-chan.png" alt="Móng tay chân" />
                  <span>Móng tay chân</span>
                </div>
                <div className="sample-item-2col">
                  <img src="/picture/cuong-ron.png" alt="Cuống rốn" />
                  <span>Cuống rốn</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "18px",
                }}
              >
                <div className="sample-item-2col">
                  <img src="/picture/nuoc-oi.png" alt="Nước ối" />
                  <span>Nước ối</span>
                </div>
                <div className="sample-item-2col">
                  <img
                    src="/picture/ban-chai-danh-rang.png"
                    alt="Bàn chải đánh răng"
                  />
                  <span>Bàn chải đánh răng</span>
                </div>
                <div className="sample-item-2col">
                  <img
                    src="/picture/dau-loc-thuoc-la.png"
                    alt="Đầu lọc thuốc lá"
                  />
                  <span>Đầu lọc thuốc lá</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chứng nhận */}
      <section className="certificate-section">
        <h2>TRUNG TÂM XÉT NGHIỆM ĐẠT CHUẨN</h2>
        <div className="certificates">
          <img src="/picture/chung-chi-1.jpg" alt="ISO 1" />
          <img src="/picture/chung-chi-2.jpg" alt="ISO 2" />
          <img src="/picture/chung-chi-3.jpg" alt="ISO 3" />
        </div>
      </section>

      <div className="homepage-container">
        {/* Các section khác */}

        {/* Cuối trang hoặc góc dưới bên phải */}
        <ChatAI />

        {/* Các button test */}
      </div>
    </div>
  );
}
