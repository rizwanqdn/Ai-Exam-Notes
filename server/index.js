import express from "express";
import donenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./utils/dbConnect.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import aiGenerate from "./routes/generateAi.routes.js";
import razorpay from "./service/razerpay.service.js";
import paymentRouter from "./routes/razorpay.route.js";
donenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "https://ai-exam-notes-client-fik1.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/gemini", aiGenerate);
app.use("/api/razorpay", paymentRouter);
app.get("/", (req, res) => {
  res.json({ message: "app running" });
});
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  dbConnect();
});
