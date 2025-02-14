import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const users: { email: string; password: string; role: string }[] = [];

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, role });

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET as string, { expiresIn: "2h" });

    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    console.error("🚨 Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "2h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("🚨 Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
