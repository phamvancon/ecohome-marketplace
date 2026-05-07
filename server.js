import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Mảng lưu trữ các mã nội dung chuyển khoản đã thanh toán thành công
const paidCodes = [];

/**
 * Endpoint nhận Webhook từ SePay
 * Cấu hình URL này tại SePay: https://your-server-url.com/webhook-sepay
 */
app.post('/webhook-sepay', (req, res) => {
    const body = req.body;
    
    // SePay gửi nội dung chuyển khoản trong trường 'content'
    const content = body.content || '';
    
    if (content) {
        paidCodes.push(content);
        console.log(`Nhận thanh toán thành công cho mã: ${content}`);
    }
    
    res.json({ success: true });
});

/**
 * Endpoint cho phép Client (Web App) kiểm tra trạng thái thanh toán
 */
app.get('/check-payment', (req, res) => {
    const code = req.query.code;
    
    res.json({
        paid: paidCodes.includes(code)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SePay webhook server đang chạy tại cổng ${PORT}`);
});
