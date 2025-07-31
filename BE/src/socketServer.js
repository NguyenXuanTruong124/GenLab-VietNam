const { Server } = require("socket.io");
const { createClient } = require("redis");
const Information = require("./models/Information"); // Thêm dòng này

const redisClient = createClient();
redisClient.connect().catch(console.error);

const allUsers = new Set(); // ✅ Lưu khách hàng từng chat

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        // Khi người dùng (customer hoặc staff) kết nối
        socket.on("join", async ({ accountId, role, name }) => {
            if (!accountId || !role || !name) return;

            // Lưu tên người dùng vào Redis
            await redisClient.hSet("usernames", accountId, name);

            if (role.toLowerCase() === "staff") {
                socket.join("staff");

                // Lấy danh sách accountId đã từng chat
                const ids = Array.from(allUsers);
                let result = [];
                if (ids.length > 0) {
                    // Lấy tên từ bảng Information
                    const infos = await Information.findAll({
                        where: { Account_ID: ids },
                        attributes: ["Account_ID", "Name_Information"]
                    });
                    // Map về dạng { accountId, name }
                    result = ids.map(id => {
                        const info = infos.find(i => String(i.Account_ID) === String(id));
                        return {
                            accountId: id,
                            name: info ? info.Name_Information : "Customer"
                        };
                    });
                }
                socket.emit("user-list", result);
            } else {
                // Khách hàng
                socket.join(accountId);
                allUsers.add(accountId);
            }

            console.log(`🟢 ${role} joined: ${name} (${accountId})`);
        });

        // ✅ Khách gửi tin nhắn
        socket.on("send_message", async ({ accountId, message }) => {
            if (!accountId || !message?.trim()) return;

            const key = `chat:${accountId}`;
            const entry = JSON.stringify({ message, from: accountId, time: Date.now() });

            await redisClient.rPush(key, entry);
            await redisClient.expire(key, 60 * 60 * 24 * 3);

            allUsers.add(accountId); // Bảo đảm khách có mặt

            // Gửi cho staff
            io.to("staff").emit("receive_message", {
                accountId,
                message,
                from: accountId,
            });

            // Gửi lại cho chính khách (để thấy tin)
            socket.emit("receive_message", {
                accountId,
                message,
                from: accountId,
            });
        });

        // ✅ Staff trả lời
        socket.on("reply_message", async ({ accountId, message }) => {
            if (!accountId || !message?.trim()) return;

            const key = `chat:${accountId}`;
            const entry = JSON.stringify({ message, from: "staff", time: Date.now() });

            await redisClient.rPush(key, entry);
            await redisClient.expire(key, 60 * 60 * 24 * 3);

            // Gửi cho khách
            io.to(accountId).emit("receive_message", {
                accountId,
                message,
                from: "staff",
            });

            // Gửi lại cho staff
            socket.emit("receive_message", {
                accountId,
                message,
                from: "staff",
            });
        });

        // ✅ Lấy lịch sử
        socket.on("load-history", async ({ from, to }) => {
            const key = `chat:${from === "staff" ? to : from}`;
            const entries = await redisClient.lRange(key, 0, -1);
            const msgs = entries.map((entry) => {
                const parsed = JSON.parse(entry);
                return {
                    from: parsed.from,
                    to: from === "staff" ? "staff" : to,
                    text: parsed.message,
                    time: parsed.time,
                };
            });

            socket.emit("chat-history", msgs);
        });

        // ✅ Ngắt kết nối
        socket.on("disconnect", () => {
            console.log("🔌 Socket disconnected:", socket.id);
        });
    });
};
