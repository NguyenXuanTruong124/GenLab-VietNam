import React from "react";
import "../skin_web/AboutPage.css";

function About() {
  return (
    <div className="about-container">
      {/* 1. Giới thiệu chung */}
      <section className="about-intro">
        <h1>GIỚI THIỆU TRUNG TÂM XÉT NGHIỆM GENLAB</h1>
        <p>
          Trung tâm xét nghiệm GENLAB VIETNAM được thành lập ngày 07 tháng 10
          năm 2022, là đơn vị tiên phong trong lĩnh vực xét nghiệm ADN với đội
          ngũ chuyên gia hàng đầu và công nghệ hiện đại. Chúng tôi cam kết mang
          lại kết quả chính xác, bảo mật và dịch vụ tận tâm nhất cho khách hàng
          trên toàn quốc.
        </p>
        <table className="about-info-table">
          <tbody>
            <tr>
              <td>Tên thương hiệu</td>
              <td>GENLAB VIETNAM</td>
            </tr>
            <tr>
              <td>Tên viết tắt</td>
              <td>ADN TESTING LLC</td>
            </tr>
            <tr>
              <td>Tên quốc tế</td>
              <td>ADN TESTING LIABILITY LIMITED</td>
            </tr>
            <tr>
              <td>Mã số thuế</td>
              <td>1801732102</td>
            </tr>
            <tr>
              <td>Địa chỉ</td>
              <td>38B đường 81, phường Tân Quy, quận 7, TP. Hồ Chí Minh</td>
            </tr>
            <tr>
              <td>Người đại diện</td>
              <td>Đỗ Thị Thu Hiền</td>
            </tr>
            <tr>
              <td>Điện thoại</td>
              <td>08.777.999.44 – 0945.171.010</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 2. Tầm nhìn, Sứ mệnh, Giá trị cốt lõi */}
      <section className="about-vision">
        <h2>Tầm nhìn Genlab Vietnam</h2>
        <p>
          Trở thành trung tâm có văn phòng trên toàn quốc, cam kết mang lại
          những xét nghiệm chính xác, chất lượng, giá trị đến từng khách hàng
          thông qua nghiên cứu, công nghệ tiên tiến và sự tận tâm, trách nhiệm.
        </p>
        <h2>Sứ mệnh</h2>
        <p>
          Mang đến dịch vụ xét nghiệm ADN di truyền đạt chất lượng tốt nhất tại
          Việt Nam, xóa tan mọi nghi ngờ về mối quan hệ huyết thống, mang lại
          niềm tin và tiếng cười cho mọi gia đình.
        </p>
        <h2>Giá trị cốt lõi</h2>
        <ul>
          <li>
            <b>Chất lượng tốt – Uy tín hàng đầu:</b> Đội ngũ chuyên môn giàu
            kinh nghiệm, cam kết chất lượng đúng quy trình.
          </li>
          <li>
            <b>Khách hàng là trọng tâm:</b> Không ngừng cải thiện dịch vụ, tư
            vấn chuyên sâu, hỗ trợ tận nơi.
          </li>
          <li>
            <b>Hợp tác để phát triển:</b> Luôn là nơi kết nối dịch vụ xét nghiệm
            chất lượng nhất tại Việt Nam.
          </li>
        </ul>
      </section>

      {/* 3. Cơ sở vật chất & Công nghệ */}
      <section className="about-facility">
        <h2>Cơ sở vật chất và công nghệ sử dụng</h2>
        <h3 className="about-subtitle">Hệ thống trang thiết bị hiện đại</h3>
        <p>
          Genlab Vietnam sở hữu LAB đạt chuẩn ISO 9001-2015 hệ thống thiết bị
          máy móc, trang thiết bị hiện đại và tiên tiến hàng đầu, được nhập khẩu
          trực tiếp từ hãng uy tín như Đức, Mỹ, Hàn Quốc. Công nghệ phân tích
          bản quyền, được chứng nhận bởi illumina, Applied-Biosystems, Qiagen,
          Sigma,.. Mẫu xét nghiệm được thực hiện tại Genlab Vietnam luôn đảm bảo
          quy trình khép kín.
        </p>
        <div className="about-images-grid">
          <img
            src="/picture/quy-trinh-xet-nghiem.jpg"
            alt="Quy trình xét nghiệm"
          />

          <img src="/picture/phong-xet-nghiem2.jpg" alt="Phòng xét nghiệm" />
        </div>
      </section>

      <section className="about-technology">
        <h3 className="about-subtitle">Công nghệ hàng đầu thế giới</h3>
        <p>
          Genlab sử dụng bộ kit chuẩn quốc tế PowerPlex Fusion, PowerPlex Y23
          (Mỹ), Investigator X-12 (Đức) được sử dụng phổ biến nhất tại các phòng
          thí nghiệm trên toàn thế giới như: Cục điều tra liên bang Mỹ (FBI),
          Cảnh sát liên bang Úc (AFP), phòng thí nghiệm của cảnh sát Singapore
          (SDF), trung tâm giám định ADN – Viện khoa học hình sự, Bộ Công An.
        </p>
        <div className="about-image-large">
          <img
            src="/picture/co-so-trung-tam-xet-nghiem1.jpg"
            alt="Cơ sở trung tâm"
          />
        </div>
      </section>

      {/* 4. Hội đồng tham vấn y khoa */}
      <section className="about-expert">
        <h2>Hội đồng tham vấn y khoa</h2>
        <p>
          Hội đồng tham vấn y khoa của GENLAB gồm một nhóm các bác sĩ, dược sĩ
          có kiến thức chuyên môn cao. Nhóm chuyên gia có nhiệm vụ đảm bảo nội
          dung đăng tải chính xác về mặt y tế và phản ánh thông tin sức khỏe mới
          nhất. Hội đồng chuyên gia y tế giàu kinh nghiệm của chúng tôi đảm bảo
          nội dung trên trang Tin Y Tế GENLAB là chính xác. Vì vậy người đọc có
          thể hoàn toàn tin tưởng vào những nội dung được xuất bản trên GÓC SỨC
          KHỎE của chúng tôi. Để từ đó có thể tiếp nhận những thông tin hữu ích,
          các kiến thức đúng đắn và đưa ra các quyết định hợp lý nhằm bảo vệ sức
          khỏe của bản thân và cho cả gia đình. Tìm hiểu về: Hội đồng tham vấn y
          khoa của chúng tôi
        </p>
      </section>

      {/* 5. Biên tập viên & Chính sách nội dung */}
      <section className="about-editor">
        <h2>Biên tập viên và chính sách nội dung</h2>
        <p>
          Sức khỏe là vốn quý giá nhất của con người. Vì vậy, chúng tôi biết bạn
          luôn có sự chọn lọc khi tìm hiểu thông tin y tế. Đó cũng là lý do tại
          sao chúng tôi tuyển chọn những bác sĩ, dược sĩ được đào tạo chuyên môn
          bài bản. Hội tụ tại GENFAMILY là đội ngũ biên tập viên gồm bác sĩ,
          dược sĩ đầy tâm huyết vì người bệnh và cộng đồng. Tất cả đều hướng đến
          một mục đích chung đó là cống hiến thời gian, sức lực cũng như kiến
          thức chuyên môn của bản thân cho công cuộc truyền tải những thông tin
          y khoa đáng tin cậy đến với cộng đồng. Bài viết trên GENLAB đều được
          trích dẫn từ các nguồn chính thống, cập nhật thường xuyên để đảm bảo
          tính xác thực của thông tin và tuân theo các Chính sách biên tập nội
          dung mà chúng tôi đã đề ra.
        </p>
      </section>

      {/* 6. Hệ thống văn phòng thu mẫu */}
      <section className="about-offices">
        <h2>Hệ thống văn phòng thu mẫu</h2>
        <ul>
          <li>
            <b>GENFLAB HCM:</b> 38B đường 81, phường Tân Quy, quận 7, TP. Hồ Chí
            Minh.
          </li>
        </ul>
      </section>

      {/* 7. Báo chí nói về GENFAMILY */}
      <section className="about-press">
        <h2>Báo chí nói gì về GENLAB</h2>
        <ul>
          <li>
            Báo 24h.com.vn:{" "}
            <a href="#">
              Quy trình xét nghiệm ADN tại nhà và địa chỉ xét nghiệm uy tín
            </a>
          </li>
          <li>
            Báo An Giang:{" "}
            <a href="#">
              Xét nghiệm ADN ở đâu uy tín, giá tốt, có kết quả nhanh?
            </a>
          </li>
          <li>
            ALOBACSI:{" "}
            <a href="#">GenLab – Địa chỉ xét nghiệm ADN uy tín tại Việt Nam</a>
          </li>
        </ul>
        <div className="about-contact">
          <p>
            <b>Địa chỉ:</b> 38B đường 81, phường Tân Quy, quận 7, TP. Hồ Chí
            Minh.
          </p>
          <p>
            <b>Hotline:</b> 0877.799.944
          </p>
          <p>
            <b>Email:</b> genlabietnam@gmail.com
          </p>
          <p>
            <b>Website:</b>{" "}
            <a href="https://trungtamxetnghiem.vn">trungtamxetnghiem.vn</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
