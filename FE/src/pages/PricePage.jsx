import React from "react";
import "../skin_web/PricePage.css";

export default function PricePage() {
  return (
    <div className="pricepage-container">
      <h1 className="price-title">BẢNG GIÁ XÉT NGHIỆM ADN HUYẾT THỐNG</h1>
      <div className="price-update">Cập nhật mới nhất 26/03/2025</div>
      <p className="price-desc">
        Bảng giá xét nghiệm ADN huyết thống tại <b>GenFamily</b> được lưu hành
        và áp dụng toàn bộ địa điểm thu mẫu tại Việt Nam.
      </p>

      {/* BẢNG GIÁ XÉT NGHIỆM ADN HUYẾT THỐNG DÂN SỰ */}
      <section className="price-section">
        <h2>
          1. BẢNG GIÁ XÉT NGHIỆM ADN HUYẾT THỐNG DÂN SỰ (GIẢI TỎA NGHI NGỜ)
        </h2>
        <h3>Phân tích quan hệ huyết thống trực hệ: Cha/mẹ – con</h3>
        <p>
          Phân tích từ <b>24 đến 33 loci</b> sử dụng bộ{" "}
          <b>kit Powerplex Fusion, HDplex-Mỹ</b>. Cho mối quan hệ huyết thống
          trực hệ: cha-con; mẹ-con. Độ chính xác 99,9999999%.
        </p>
        <table className="price-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>CHI PHÍ 2 MẪU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3 ngày</td>
              <td>3.000.000đ</td>
            </tr>
            <tr>
              <td>24 giờ</td>
              <td>6.000.000đ</td>
            </tr>
            <tr>
              <td>6 giờ</td>
              <td>8.000.000đ</td>
            </tr>
          </tbody>
        </table>
        <h3>Phân tích quan hệ họ hàng</h3>
        <p>
          <i>
            Ông nội – cháu trai; bà nội – cháu gái; chú/bác (anh em trai của bố)
            – cháu trai; anh em trai cùng cha; chị em gái cùng cha
          </i>
        </p>
        <p>
          Phân tích <b>23 loci</b> trên nhiễm sắc thể Y và 12 loci trên NST X.
          Cho mối quan hệ theo dòng nội độ, chính xác 99,9999%.
        </p>
        <table className="price-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>CHI PHÍ 2 MẪU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>7 ngày</td>
              <td>4.000.000đ</td>
            </tr>
            <tr>
              <td>2 ngày</td>
              <td>5.000.000đ</td>
            </tr>
            <tr>
              <td>24 giờ</td>
              <td>7.000.000đ</td>
            </tr>
            <tr>
              <td>4 giờ</td>
              <td>10.000.000đ</td>
            </tr>
          </tbody>
        </table>
        <p>
          <i>
            Bà ngoại – cháu trai/gái; Cậu/Dì (anh chị em của mẹ) – cháu
            trai/gái; Anh chị em cùng mẹ
          </i>
        </p>
        <p>
          Phân tích ADN ty thể. Cho mối quan hệ theo dòng ngoại, độ chính xác
          99,9999%.
        </p>
        <table className="price-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>CHI PHÍ 2 MẪU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>7 ngày</td>
              <td>5.000.000đ</td>
            </tr>
            <tr>
              <td>5 ngày</td>
              <td>8.000.000đ</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BẢNG GIÁ XÉT NGHIỆM ADN HÀNH CHÍNH PHÁP LÝ */}
      <section className="price-section">
        <h2>2. BẢNG GIÁ XÉT NGHIỆM ADN HÀNH CHÍNH PHÁP LÝ</h2>
        <p>
          Làm thủ tục giấy khai sinh, nhận cha, đổi họ cho con, nhập quốc tịch,
          thừa kế, cấp visa, tranh chấp tại tòa,…
        </p>
        <table className="price-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>CHI PHÍ 2 MẪU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3 ngày</td>
              <td>4.000.000đ</td>
            </tr>
            <tr>
              <td>24 giờ</td>
              <td>7.000.000đ</td>
            </tr>
            <tr>
              <td>6 giờ</td>
              <td>10.000.000đ</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BẢNG GIÁ XÉT NGHIỆM ADN DÀNH CHO THAI PHỤ */}

      {/* BẢNG GIÁ XÉT NGHIỆM THẺ ADN CÁ NHÂN */}
      <section className="price-section">
        <h2>3. BẢNG GIÁ XÉT NGHIỆM THẺ ADN CÁ NHÂN</h2>
        <table className="price-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>CHI PHÍ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>7 ngày</td>
              <td>2.500.000đ</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Lưu ý */}
      <section className="price-section">
        <h2>4. LƯU Ý DÀNH CHO KHÁCH HÀNG</h2>
        <ul className="price-note">
          <li>
            Bảng giá trên đã bao gồm toàn bộ chi phí xét nghiệm, không phát sinh
            thêm.
          </li>
          <li>Khách hàng được tư vấn miễn phí trước khi làm xét nghiệm.</li>
          <li>
            Đối với các trường hợp đặc biệt hoặc yêu cầu riêng, vui lòng liên hệ
            để được báo giá chi tiết.
          </li>
          <li>
            Hotline: <a href="tel:0877799944">08.777.999.44</a>
          </li>
          <li>
            Email:{" "}
            <a href="mailto:info@trungtamxetnghiem.vn">
              info@trungtamxetnghiem.vn
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
