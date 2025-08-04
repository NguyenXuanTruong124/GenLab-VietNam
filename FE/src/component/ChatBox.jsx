import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const accountId = user?.id;
  const role = user?.role;
  const staffId = "staff"; // vẫn còn tạm hardcode, sẽ sửa sau nếu nhiều staff

  // Join + lấy lịch sử (1 lần)
  useEffect(() => {
    if (!accountId || role !== "Customer") return;

    socket.emit("join", {
      accountId,
      role,
      name: user.name || "Khách hàng",
    });

    socket.emit("load-history", {
      from: accountId,
      to: staffId,
    });
  }, [accountId, role]);

  // Nhận lịch sử (duy nhất 1 lần)
  useEffect(() => {
    socket.on("chat-history", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off("chat-history");
    };
  }, []);

  // Nhận tin nhắn thời gian thực
  useEffect(() => {
    socket.on("receive_message", ({ accountId: targetId, from, message }) => {
      if (targetId !== accountId) return; // chỉ nhận nếu đúng người dùng
      setMessages((prev) => [...prev, { from, text: message }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [accountId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!msg.trim() || !accountId) return;

    socket.emit("send_message", { accountId, message: msg });
    setMsg("");
  };

  const handleChatClick = () => {
    if (!accountId || role !== "Customer") {
      setShowLoginPrompt(true);
    } else {
      setOpen(!open);
    }
  };

  return (
    <>
      {/* ICON CHAT */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#007bff",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: 30,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
        onClick={handleChatClick}
      >
        💬
      </div>

      {/* CHAT BOX */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 300,
            height: 400,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#007bff",
              color: "white",
              padding: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            Hỗ trợ khách hàng
          </div>

          {/* Tin nhắn */}
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
              fontSize: 14,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.from === accountId ? "right" : "left",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: m.from === accountId ? "#daf1ff" : "#eee",
                    padding: "6px 10px",
                    borderRadius: 10,
                    maxWidth: "80%",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: 10,
              borderTop: "1px solid #ccc",
            }}
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: 8,
                fontSize: 14,
                borderRadius: 5,
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={send}
              style={{
                marginLeft: 5,
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* POPUP: yêu cầu đăng nhập */}
      {showLoginPrompt && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 20,
            width: 300,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1001,
            padding: 15,
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: 10 }}>
            Vui lòng đăng nhập để sử dụng chat hỗ trợ.
          </p>
          <button
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 5,
              cursor: "pointer",
              marginRight: 10,
            }}
            onClick={() => {
              window.location.href = "/signin";
            }}
          >
            Đăng nhập
          </button>
          <button
            style={{
              background: "gray",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 5,
              cursor: "pointer",
            }}
            onClick={() => setShowLoginPrompt(false)}
          >
            Đóng
          </button>
        </div>
      )}
    </>
  );
}
