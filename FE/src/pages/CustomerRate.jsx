import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CustomerRate = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({}); // { [BD_ID]: { rate, comment } }
  const [isCustomer, setIsCustomer] = useState(false);
  const [userRole, setUserRole] = useState(""); // Thêm state userRole

  useEffect(() => {
    // Lấy role từ token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsCustomer(decoded.role === "Customer");
        setUserRole(decoded.role || ""); // Lưu role
      } catch {
        setIsCustomer(false);
        setUserRole("");
      }
    } else {
      setIsCustomer(false);
      setUserRole("");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/api/rating/${bookingId}/details`)
      .then((res) => {
        setDetails(res.data.details || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách dịch vụ để đánh giá.");
        setLoading(false);
      });
  }, [bookingId]);

  const handleChange = (bdId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [bdId]: {
        ...prev[bdId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (bdId) => {
    const { rate, comment } = form[bdId] || {};
    if (!rate) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:3001/api/rating/${bdId}/rate`, {
        rate,
        comment,
      });
      setSuccessMsg("Đánh giá thành công!");
      // Cập nhật lại trạng thái đã đánh giá
      setDetails((prev) =>
        prev.map((d) =>
          d.BD_ID === bdId
            ? { ...d, Rate: rate, Comment: comment, IsCommented: 1 }
            : d
        )
      );
    } catch (e) {
      alert("Gửi đánh giá thất bại!");
    }
    setSubmitting(false);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2>Đánh giá dịch vụ</h2>
      <button
        onClick={() => {
          if (userRole === "Customer") navigate("/");
          else if (userRole === "Staff") navigate("/staff");
          else if (userRole === "Manager") navigate("/manager");
          else navigate("/");
        }}
      >
        ← Quay lại lịch sử
      </button>
      {successMsg && <div style={{ color: "green", margin: "12px 0" }}>{successMsg}</div>}
      {details.length === 0 ? (
        <div>Bạn không có dịch vụ nào để đánh giá.</div>
      ) : (
        <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Dịch vụ</th>
              <th>Loại</th>
              <th>Đánh giá</th>
              <th>Bình luận</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {details.map((d) => (
              <tr key={d.BD_ID} style={{ borderBottom: "1px solid #eee" }}>
                <td>{d.Service_name}</td>
                <td>{d.Cate_Name}</td>
                <td>
                  {d.IsCommented ? (
                    <span style={{ color: "#f39c12", fontWeight: 600 }}>{d.Rate} ★</span>
                  ) : (
                    <select
                      value={form[d.BD_ID]?.rate || ""}
                      onChange={(e) => handleChange(d.BD_ID, "rate", e.target.value)}
                      disabled={submitting || !isCustomer}
                    >
                      <option value="">Chọn sao</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} ★</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {d.IsCommented ? (
                    <span>{d.Comment || "(Không có)"}</span>
                  ) : (
                    <input
                      type="text"
                      placeholder="Nhập bình luận"
                      value={form[d.BD_ID]?.comment || ""}
                      onChange={(e) => handleChange(d.BD_ID, "comment", e.target.value)}
                      disabled={submitting || !isCustomer}
                      style={{ width: 120 }}
                    />
                  )}
                </td>
                <td>
                  {d.IsCommented ? (
                    <span style={{ color: "green" }}>Đã đánh giá</span>
                  ) : (
                    isCustomer && (
                      <button
                        onClick={() => handleSubmit(d.BD_ID)}
                        disabled={submitting}
                        style={{ background: "#3498db", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer" }}
                      >
                        Gửi
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerRate;
