import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { conn } from "../config/dbconnect";
import { RowDataPacket } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

import { CustomRequest } from "../Model/auth";


export const authCheck = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const headerToken =  req.headers.authorization;

    if (!headerToken) {
      return res.status(401).json({
        message: "No token, Authorization denied",
      });
    }

   
    const token = headerToken.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    
    const decoded = jwt.verify(token, process.env.SECRET as string);

   
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
export const adminCheck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } : any = req.user;

    // Query DB ตรวจสอบ role
    const [rows] = await conn.query<RowDataPacket[]>(
      "SELECT role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Access Denied, Admins Only" });
    }

   
    next();
  } catch (error) {
    console.error("Admin Check Error:", error);
    res.status(500).json({ message: "Admin Check Failed" });
  }
};
