import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { conn } from "../config/dbconnect";
import { UserPostRequest } from "../Model/auth"; 
import jsonwebtoken from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [rows]: any = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Rows [0] to Db
    const user = rows[0];
     const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jsonwebtoken.sign(payload, process.env.SECRET as string, {
      expiresIn: "1d", 
    });
    
    
    res.json({
      success: true,
      message: "Login successful",
      payload,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const register = async (req: Request, res: Response) => {
  try {
    const user: UserPostRequest = req.body;

  
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง"
      });
    }

    
    const [existingUser]: any = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [user.email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
   
    const sql =
      "INSERT INTO users (username, email, password, wallet_balance, profile_image) VALUES (?, ?, ?, ?, ?)";

    const [result]: any = await conn.query(sql, [
      `${user.firstName} ${user.lastName}`, 
      user.email,
      hashedPassword,
      user.wallet || 0,
      null
    ]);

    res.status(201).json({
      success: true,
      message: "Register inserted successfully",
      userId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};