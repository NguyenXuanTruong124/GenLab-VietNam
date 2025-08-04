import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3001");

export default function StaffChatPage() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]); // [{ accountId, name }]
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const staffId = user?.id;
    const name = user?.name || "Nhân viên";

    useEffect(() => {
        if (!staffId) return;

        socket.emit("join", {
            accountId: staffId,
            role: "Staff",
            name,
        });

        // Nhận tin nhắn realtime
        socket.on("receive_message", (msg) => {
            const otherParty = msg.from === "staff" ? msg.accountId : msg.from;

            // ✅ Nếu đang chat với người đó → push tin
            if (otherParty === selectedAccountId) {
                setMessages((prev) => [
                    ...prev,
                    {
                        from: msg.from,
                        text: msg.text || msg.message || "",
                    },
                ]);
            }

            // ✅ Nếu chưa có trong danh sách → thêm vào
            setUserList((prev) => {
                const exists = prev.some((u) => u.accountId === otherParty);
                return exists ? prev : [...prev, { accountId: otherParty, name: otherParty }];
            });
        });

        // Nhận danh sách khách hàng
        socket.on("user-list", (users) => {
            setUserList(users); // [{ accountId, name }]
        });

        return () => {
            socket.off("receive_message");
            socket.off("user-list");
        };
    }, [staffId, name, selectedAccountId]);

    // Nhận lịch sử chat
    useEffect(() => {
        socket.on("chat-history", (msgs) => {
            setMessages(msgs.map((m) => ({
                from: m.from,
                text: m.text || m.message || "",
            })));
        });

        return () => {
            socket.off("chat-history");
        };
    }, []);

    const selectConversation = (accountId) => {
        setSelectedAccountId(accountId);
        socket.emit("load-history", {
            from: "staff",
            to: accountId,
        });
    };

    const sendMessage = () => {
        if (!messageText.trim()) return;

        socket.emit("reply_message", {
            accountId: selectedAccountId,
            message: messageText,
        });

        setMessageText("");
    };

    return (
        <div>
            <button onClick={() => navigate('/')} style={{margin: '16px 0 8px 0', padding: '8px 18px', background: '#2176bd', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer'}}>Trang chủ</button>
            <div style={{ display: "flex", height: "80vh" }}>
                {/* Danh sách hội thoại */}
                <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: 10 }}>
                    <h3>Khách hàng</h3>
                    {userList.map(({ accountId, name }) => (
                        <div
                            key={accountId}
                            onClick={() => selectConversation(accountId)}
                            style={{
                                padding: 8,
                                cursor: "pointer",
                                background: selectedAccountId === accountId ? "#eee" : "white",
                            }}
                        >
                            {name} <small style={{ color: "#888" }}>({accountId})</small>
                        </div>
                    ))}
                </div>

                {/* Nội dung chat */}
                <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column" }}>
                    <h3>
                        Chat với:{" "}
                        {selectedAccountId
                            ? userList.find((u) => u.accountId === selectedAccountId)?.name ||
                            selectedAccountId
                            : "Chọn khách hàng"}
                    </h3>

                    <div
                        style={{
                            flex: 1,
                            border: "1px solid #ddd",
                            padding: 10,
                            overflowY: "auto",
                            marginBottom: 10,
                        }}
                    >
                        {messages.map((msg, idx) => {
                            let displayName = "";
                            if (msg.from === "staff") {
                                displayName = "Bạn";
                            } else {
                                // Tìm tên khách theo accountId
                                const user = userList.find(u => u.accountId === selectedAccountId);
                                displayName = user ? user.name : msg.from;
                            }
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        textAlign: msg.from === "staff" ? "right" : "left",
                                        margin: "5px 0",
                                    }}
                                >
                                    <strong>{displayName}:</strong>{" "}
                                    {msg.text}
                                </div>
                            );
                        })}
                    </div>

                    {selectedAccountId && (
                        <div>
                            <input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Nhập tin nhắn..."
                                style={{ width: "80%", padding: 8 }}
                            />
                            <button onClick={sendMessage} style={{ padding: 8 }}>
                                Gửi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}