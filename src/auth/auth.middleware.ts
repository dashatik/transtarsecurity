import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { email: string; role: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("🚨 No token provided or incorrect format");
    res.status(401).json({ error: "Access denied" });
    return; 
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Received Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string; role: string };
    console.log("✅ Token Decoded:", decoded);
    req.user = decoded;
    return next();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("🚨 JWT Verification Failed:", errorMessage);
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};

// ✅ Middleware to authorize roles
export const authorizeRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.error("🚨 Unauthorized role:", req.user?.role);
      res.status(403).json({ error: "Unauthorized access" });
      return;
    }
    return next();
  };
};
