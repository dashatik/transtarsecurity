import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./auth/auth.routes";
import secureRoutes from "./routes/secure.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🚀 Transtar Security API is Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/secure", secureRoutes);

console.log("✅ JWT Secret Loaded:", process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
