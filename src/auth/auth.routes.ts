import express from "express";
import { registerUser, loginUser } from "./auth.controller";

const router = express.Router();

// Define API routes correctly
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
