import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: { email: string; password: string; role: string }[] = [];

const generateToken = (email: string, role: string): string => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET as string, { expiresIn: "2h" });
};

// User Signup
export const registerUser = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, role });

    const token = generateToken(email, role);
    return res.status(201).json({ message: "User registered", token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(email, user.role);
    return res.json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
