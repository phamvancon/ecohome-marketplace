const express = require("express");
const admin = require("firebase-admin");
const app = express();

app.use(express.json());

// --- KHỞI TẠO FIREBASE ADMIN ---
// Bạn cần tải file serviceAccountKey.json từ Firebase Console -> Project Settings -> Service Accounts
// const serviceAccount = require("./path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();
// const appId = "ecohome-marketplace-97aa6";

app.get("/", (req, res) => {
    res.send("Webhook SePay Chợ Ecohome đang chạy ổn định...");
});

// --- XỬ LÝ WEBHOOK SEPAY ---
app.post("/webhook-sepay", async (req, res) => {
    console.log("SEPAY DATA RECEIVED:", req.body);
    const data = req.body;

    // Chỉ xử lý nếu là giao dịch tiền vào (in)
    if (data.transferType === "in") {
        const amount = parseFloat(data.transferAmount);
        const content = data.content || ""; // Ví dụ: "VIP_SS ABC123" hoặc "PUSH XYZ789"
        
        console.log(`Phát hiện tiền vào: ${amount}đ - Nội dung: ${content}`);

        try {
            // Tách mã nội dung (Ví dụ: "VIP_SS" và "ABC123")
            const parts = content.split(" ");
            if (parts.length >= 2) {
                const type = parts[0].toUpperCase();
                const shortId = parts[1].toUpperCase();

                // 1. Xử lý Nâng cấp VIP cho User
                if (type.startsWith("VIP")) {
                    // Tìm user có UID chứa 6 ký tự cuối là shortId
                    // Lưu ý: Trong thực tế nên query collection 'users'
                    console.log(`Đang kích hoạt gói ${type} cho User ID: ${shortId}`);
                    // await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('users')
                    //    .where('shortUid', '==', shortId).limit(1).get()...
                }

                // 2. Xử lý Dịch vụ cho Bài đăng (ADS, PUSH, RENEW)
                if (type === "PUSH" || type === "ADS" || type === "RENEW") {
                    console.log(`Đang kích hoạt dịch vụ ${type} cho Bài đăng: ${shortId}`);
                    // Logic cập nhật Firestore tương ứng cho bài đăng
                }
            }
        } catch (err) {
            console.error("Lỗi xử lý dữ liệu Firebase:", err);
        }
    }

    // Luôn phản hồi 200 để SePay biết đã nhận dữ liệu thành công
    res.status(200).json({
        success: true,
        message: "Webhook processed"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server SePay Webhook đang chạy tại cổng: " + PORT);
});
