import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import "../skin_web/ChatAI.css";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messageEndRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const callGeminiAPI = async (allMessages) => {
    // Gộp tất cả messages thành 1 phần tử trong mảng contents
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: allMessages
              .map((msg) => (msg.role === "user" ? msg.text : ""))
              .join("\n"),
          },
        ],
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await res.json();
    console.log(data);
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi chưa rõ câu hỏi."
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const introPrompt = `
Bạn là trợ lý AI cho dự án GENLABVIETNAM – nền tảng hỗ trợ xét nghiệm adn tại Việt Nam.
Chỉ trả lời các câu hỏi liên quan đến xét nghiệm adn, đăng ký dịch vụ, hướng dẫn phần mềm GENLABVIETNAM.
Trả lời ngắn gọn, dễ hiểu, thân thiện.
    `.trim();

    const userMsg = { role: "user", text: introPrompt + "\n\n" + input };
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    const reply = await callGeminiAPI([...messages, userMsg]);
    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setLoading(false);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setHasGreeted(false);
  };

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([
        {
          role: "model",
          text: "Xin chào! 👋 Tôi là trợ lý AI GENLABVIETNAM. Bạn cần hỗ trợ gì hôm nay?",
        },
      ]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sự kiện mở từ bên ngoài
  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-chat", openHandler);
    return () => window.removeEventListener("open-chat", openHandler);
  }, []);


  return (
    <>
      {/* Nút chat nổi */}
      <button
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-50 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở trò chuyện"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Hộp chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[420px] bg-white rounded-xl shadow-xl flex flex-col z-40 border border-gray-300">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">GENLABVIETNAM AI</span>
            <div className="space-x-2">
              <button
                className="bg-white text-blue-600 text-xs px-2 py-1 rounded hover:bg-gray-100"
                onClick={handleReset}
              >
                Đoạn chat mới
              </button>
              <button
                className="bg-white text-blue-600 text-xs px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-2 text-sm">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring focus:ring-blue-200"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
