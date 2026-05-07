import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Lưu trữ các mã giao dịch đã thanh toán (trong bộ nhớ)
const paidCodes = new Set();

/**
 * Route mặc định để kiểm tra trạng thái server
 */
app.get("/", (req, res) => {
    res.send("SePay webhook server running");
});

/**
 * Webhook endpoint để nhận thông báo từ SePay
 */
app.post("/webhook-sepay", (req, res) => {
    try {
        const body = req.body;
        console.log("Dữ liệu Webhook nhận được:", body);

        // Lấy nội dung chuyển khoản từ trường content hoặc description
        const content = body.content || body.description || "";

        // Nếu có nội dung, thêm vào danh sách đã thanh toán
        if (content) {
            // Xử lý logic lưu mã giao dịch
            paidCodes.add(content.trim());
        }

        return res.json({
            success: true,
            message: "Nhận dữ liệu thành công"
        });

    } catch (e) {
        console.error("Lỗi Webhook:", e);
        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý dữ liệu"
        });
    }
});

/**
 * Route để phía Client kiểm tra xem một mã đã thanh toán chưa
 */
app.get("/check-payment", (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.json({ paid: false, error: "Thiếu mã kiểm tra" });
    }

    res.json({
        paid: paidCodes.has(code.trim())
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng: ${PORT}`);
});
