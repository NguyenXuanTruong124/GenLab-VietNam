import React from "react";
import '../skin_web/SampleBloodPage.css';

const BloodSample = () => {
    return (
        <div className="bloodsample-container">
            <h1 className="bloodsample-title">HƯỚNG DẪN LẤY MẪU MÁU XÉT NGHIỆM ADN</h1>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">1</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Xét nghiệm ADN là gì và tại sao nó lại quan trọng?</h2>
                    <p>Xét nghiệm ADN là phân tích vật chất di truyền để xác định đặc điểm di truyền của một người. Nó giúp xác định quan hệ huyết thống như cha/mẹ ruột, ông bà, cô dì, anh chị em,... và giải quyết các vấn đề pháp lý như quyền thừa kế, quyền nuôi con.</p>
                    <img src="/picture/mau-mau.png" alt="Xét nghiệm ADN là gì" className="bloodsample-img" />
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">2</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Xét nghiệm ADN bằng máu có chính xác không?</h2>
                    <p><b className="bloodsample-highlight">Có! Độ chính xác lên đến 99,99999998%</b>. Máu chứa nhiều ADN, dễ phân tích và ổn định, là mẫu phẩm lý tưởng.</p>
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">3</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Khi nào nên và không nên xét nghiệm ADN bằng máu?</h2>
                    <ul>
                        <li><b className="bloodsample-should">Nên:</b> cần kết quả nhanh, chính xác, có giá trị pháp lý, hoặc xét nghiệm thai nhi sớm (từ tuần 7).</li>
                        <li><b className="bloodsample-shouldnot">Không nên:</b> đã ghép tủy, truyền máu gần đây; không muốn thủ thuật xâm lấn; không thể đến cơ sở y tế.</li>
                    </ul>
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">4</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Hướng dẫn lấy mẫu máu xét nghiệm ADN tại nhà</h2>
                    <p className="bloodsample-warning"><b>Lưu ý:</b> Chỉ dùng cho mục đích cá nhân, không có giá trị pháp lý.</p>
                    <img src="/picture/bo-dung-cu.jpg" alt="Bộ dụng cụ lấy mẫu" className="bloodsample-img" />
                    <ol>
                        <li>Liên hệ trung tâm để nhận bộ dụng cụ (giấy FTA, cồn, bông gạc, kim chích, phong bì,...).</li>
                        <li>Điền thông tin cá nhân đầy đủ vào phong bì và thẻ thu mẫu.</li>
                        <li>Rửa tay sạch và lau khô.</li>
                        <li>Bẻ gập giấy FTA để máu dễ thấm.</li>
                        <li>Sát trùng đầu ngón tay, dùng kim chích lấy máu.</li>
                        <li>Thấm giọt máu (to bằng hạt đậu) vào giấy FTA và để khô tự nhiên.</li>
                        <li>Cho thẻ đã khô vào phong bì.</li>
                        <li>Gửi mẫu về trung tâm xét nghiệm.</li>
                    </ol>
                    <p className="bloodsample-tip"><b>Mẹo:</b> lắc tay trước, thả lỏng tay, đợi máu đủ lớn, chích lệch đầu ngón để ít đau. Trẻ sơ sinh nên lấy máu ở gót chân.</p>
                    <img src="/picture/bo-cu.png" alt="Mẫu đã đóng gói" className="bloodsample-img" />
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">5</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Lưu ý quan trọng khi sử dụng mẫu máu</h2>
                    <ul>
                        <li><b>Không</b> truyền máu, ghép tủy trong vòng 3 tháng trước khi lấy mẫu.</li>
                        <li>Sử dụng dụng cụ <b>sạch</b>, <b>tiệt trùng</b>.</li>
                        <li><b>Không</b> chạm vào vùng thấm máu.</li>
                        <li><b>Gửi mẫu</b> sớm nhất có thể.</li>
                    </ul>
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">6</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Xét nghiệm ADN bằng máu có tác dụng gì?</h2>
                    <ul>
                        <li>Xác định quan hệ huyết thống.</li>
                        <li>Thủ tục pháp lý: khai sinh, thêm tên cha, thừa kế, nuôi con, nhận con nuôi, làm visa.</li>
                    </ul>
                </div>
            </div>
            <div className="bloodsample-section">
                <div className="bloodsample-step-number">7</div>
                <div className="bloodsample-section-content">
                    <h2 className="bloodsample-section-title">Kết luận</h2>
                    <p>Xét nghiệm ADN bằng máu là một công cụ mạnh mẽ để xác định quan hệ huyết thống và giải quyết các vấn đề pháp lý. Tuy nhiên, hãy lựa chọn cơ sở xét nghiệm uy tín và tuân thủ đúng quy trình để đảm bảo kết quả chính xác nhất.</p>
                </div>
            </div>
        </div>
    );
};

export default BloodSample;
