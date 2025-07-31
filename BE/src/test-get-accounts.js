const sequelize = require("./config/database");
const Account = require("./models/Account");

async function getAccounts() {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối thành công đến MySQL!");

    const accounts = await Account.findAll();

    if (accounts.length === 0) {
      console.log("⚠️ Không có tài khoản nào trong bảng ACCOUNT.");
    } else {
      console.log("📋 Danh sách tài khoản:");
      accounts.forEach((account) => {
        console.log(
          `👤 ${account.UserName} - ${account.Email} - ${account.Role}`
        );
      });
    }
  } catch (err) {
    console.error("❌ Lỗi:", err);
  } finally {
    await sequelize.close();
  }
}

getAccounts();
