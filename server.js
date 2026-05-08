const express = require("express");
const admin = require("firebase-admin");
const app = express();

app.use(express.json());

// --- KHỞI TẠO FIREBASE ADMIN (Cần thiết để tự động hóa) ---
// Tải file serviceAccountKey.json từ Firebase Console và bỏ comment để sử dụng
/*
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const appId = "ecohome-marketplace-97aa6";
*/

app.get("/", (req, res) => {
    res.send("Webhook SePay đang chạy");
});

// --- XỬ LÝ WEBHOOK SEPAY ---
app.post("/webhook-sepay", async (req, res) => {
    console.log("SEPAY DATA:", req.body);
    const data = req.body;

    // Kiểm tra nếu là giao dịch tiền vào thành công
    if (data.transferType === "in") {
        console.log("Có tiền vào:", data.transferAmount);
        console.log("Nội dung:", data.content);

        try {
            // Logic xử lý tự động khi có tiền về
            // 1. Phân tích data.content để lấy mã dịch vụ và ID (Ví dụ: "VIP_SS ABC123")
            // 2. Truy vấn Firestore và cập nhật vipTier hoặc trạng thái bài đăng
            
            /* Ví dụ:
            const parts = data.content.split(" ");
            if (parts.length >= 2) {
                const type = parts[0];
                const shortId = parts[1];
                // Thực hiện update Firebase tại đây...
            }
            */
        } catch (error) {
            console.error("Lỗi cập nhật dữ liệu:", error);
        }
    }

    res.status(200).json({
        success: true
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
