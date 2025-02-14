import express from "express";
import { authenticateToken, authorizeRoles } from "../auth/auth.middleware";
import { AuthenticatedRequest } from "../types/express"; // ✅ Import custom type

const router = express.Router();

router.get("/dashboard", authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ message: `Welcome, ${req.user?.email}` });
});

router.get("/admin", authenticateToken, authorizeRoles(["admin"]), (req: AuthenticatedRequest, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;
