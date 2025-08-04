import React from "react";
import '../skin_web/TermAndServices.css'; 

export default function TermsAndServicesPage() {
  return (
    <div className="terms-container">
      <h1 className="terms-title">📄 Điều Khoản và Dịch Vụ – GENLAB VIETNAM</h1>

      <section className="terms-section">
        <h2>0. Quy định về đến cơ sở đúng giờ</h2>
        <ul>
          <li>Nếu khách hàng không đến cơ sở trong vòng 30 phút kể từ giờ hẹn, GENLAB VIETNAM sẽ hủy lịch và không hoàn tiền cho quý khách.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>1. Tài khoản và Đăng nhập</h2>
        <ul>
          <li>Mỗi tài khoản đăng ký tại GENLAB VIETNAM cần có thông tin cá nhân đầy đủ để xác thực và phục vụ quy trình xét nghiệm.</li>
          <li>Người dùng mới cần xác minh địa chỉ email bằng mã OTP trước khi đăng nhập lần đầu tiên.</li>
          <li>Một địa chỉ email chỉ được sử dụng để đăng ký một tài khoản duy nhất.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>2. Đặt lịch xét nghiệm (Booking)</h2>
        <ul>
          <li>Người dùng cần đăng nhập vào hệ thống để có thể đặt lịch xét nghiệm.</li>
          <li>Một lượt đặt lịch có thể bao gồm nhiều dịch vụ, nhưng ít nhất phải chọn một dịch vụ.</li>
          <li>Sau khi đặt lịch, hệ thống sẽ mặc định gán trạng thái “Chờ xác nhận” cho booking đó.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>3. Thanh toán</h2>
        <ul>
          <li>Khi khách hàng hoàn tất thanh toán, trạng thái booking sẽ được cập nhật thành “Đã xác nhận”.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>4. Giao Kit và Thu mẫu</h2>
        <ul>
          <li>Chỉ các booking đã được xác nhận mới đủ điều kiện để nhân viên giao bộ kit xét nghiệm.</li>
          <li>Khi việc giao Kit hoàn tất, trạng thái booking sẽ được chuyển sang “Đã giao Kit”.</li>
          <li>Nếu mẫu thử khách hàng gửi về không đạt yêu cầu:
            <ul>
              <li>Khách hàng sẽ được cấp lại một bộ kit mới miễn phí một lần.</li>
              <li>Từ lần thứ hai trở đi, khách hàng cần thanh toán chi phí cho mỗi bộ kit giao lại.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>5. Hủy lịch và Hoàn tiền</h2>
        <ul>
          <li>Khách hàng có thể yêu cầu hủy booking nếu trạng thái chưa phải là “Đang giao Kit” hoặc các bước sau đó.</li>
          <li>Nếu khách hàng không đến cơ sở trong vòng 20 phút kể từ giờ hẹn, lịch sẽ bị hủy và quý khách sẽ không được hoàn tiền.</li>
          <li>Chính sách hoàn tiền:
            <ul>
              <li>Hoàn 100% nếu khách hàng yêu cầu hủy trước khi booking được xác nhận.</li>
              <li>Hoàn 80% nếu yêu cầu hủy được gửi sau khi booking đã xác nhận, nhưng trước khi giao kit.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>6. Đánh giá và Phản hồi</h2>
        <ul>
          <li>Chỉ các booking có trạng thái “Hoàn tất” mới có thể gửi đánh giá và phản hồi về dịch vụ.</li>
          <li>Mỗi dịch vụ chỉ được đánh giá một lần duy nhất cho mỗi khách hàng.</li>
        </ul>
      </section>
    </div>
  );
}
