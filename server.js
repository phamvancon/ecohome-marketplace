import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const paidCodes = new Set();

app.get("/", (req, res) => {
    res.send("SePay webhook server running");
});

app.post("/webhook-sepay", (req, res) => {

    try {

        const body = req.body;

        console.log("Webhook:", body);

        const content =
            body.content ||
            body.description ||
            "";

        if (content) {
            paidCodes.add(content);
        }

        return res.json({
            success: true
        });

    } catch (e) {

        console.error(e);

        return res.status(500).json({
            success: false
        });
    }
});

app.get("/check-payment", (req, res) => {

    const code = req.query.code;

    res.json({
        paid: paidCodes.has(code)
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running:", PORT);
});