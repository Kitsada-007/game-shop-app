import { Request, Response } from "express";
import { conn } from "../config/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../Model/auth";
import { UserReq , UserRes} from "../Model/user";

//  Test
export const read = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user;
    console.log(id);
    // ใช้ await ให้ query เสร็จก่อน
    const [rows] = await conn.query("SELECT * FROM users where id = ?", [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : error,
    });
  }
};

export const editUser = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user; // ดึงจาก JWT
    const user: UserReq = req.body; // partial เผื่อแก้ไขแค่บางฟิลด์
    console.log(user.email + " " + user.username) 
    // 1. select ข้อมูลเดิม
    let sql = "SELECT * FROM users WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);
    const result = rows as UserRes[];

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. merge ข้อมูลใหม่กับข้อมูลเดิม
    const userOriginal = result[0];
    const updateUser = { ...userOriginal, ...user };

    // 3. update DB
    sql = `
      UPDATE users 
      SET username = ?, email = ?
      WHERE id = ?`;

    const [updateResult]: any = await conn.query(sql, [
      updateUser.username,
      updateUser.email,
      id,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "Update failed" });
    }

    // 4. response
    res.status(200).json({
      message: "User updated successfully",
      affected_row: updateResult.affectedRows,
      updatedUser: updateUser,
    });

  } catch (error: any) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const wallet = async (req: CustomRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const { id }: any = req.user;

    // ✅ ตรวจสอบ input
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (amount > 1000000) {
      return res.status(400).json({ message: "Do not top up more than 1 million!" });
    }

    // 🔒 ล็อก row ของ user ก่อน (ป้องกัน race condition)
    const [rows]: any = await conn.query(
      "SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const oldBalance = parseFloat(rows[0].wallet_balance);
    const newBalance = oldBalance + parseFloat(amount);

    // ✅ อัปเดตยอดเงิน
    await conn.query(
      "UPDATE users SET wallet_balance = ? WHERE id = ?",
      [newBalance, id]
    );

    // ✅ บันทึกประวัติการทำธุรกรรม
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'topup', ?, ?)",
      [id, amount, "Top-up wallet"]
    );

    

    res.status(200).json({
      message: "Wallet topped up successfully",
      new_balance: newBalance,
    });
  } catch (error: any) {
    
    console.error("Wallet Error:", error);
    res.status(400).json({ message: error.message || "Transaction failed" });
  } 
};

export const transactions = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user;
    console.log(id);
    const [rows] = await conn.query(
      "SELECT * FROM transactions where user_id = ?",
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({
      massges: error,
    });
  }
};
export const transactionsById = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.params;
    console.log(id);
    const [rows] = await conn.query(
      "SELECT * FROM transactions where user_id = ?",
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({
      massges: error,
    });
  }
};

export const library = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user;
    console.log(id);
    const [result] = await conn.query(
      "SELECT game_id, g.name, g.price FROM user_games ug JOIN games g ON ug.game_id = g.id where ug.user_id = ?",
      [id]
    );
    if ((result as any[]).length === 0) {
      return res.status(404).json({
        message: "Game not found in your library",
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      massges: error,
    });
  }
};
export const libraryById = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user; // id ของ user จาก JWT
    const { game_id } = req.params; // game_id จาก params

    const [result] = await conn.query(
      `SELECT g.id as game_id, g.name, g.price, g.genre, g.description, g.release_date
       FROM user_games ug 
       JOIN games g ON g.id = ug.game_id 
       WHERE ug.user_id = ? AND ug.game_id = ?`,
      [id, game_id]
    );

    if ((result as any[]).length === 0) {
      return res.status(404).json({
        message: "Game not found in your library",
      });
    }

    res.status(200).json(result); // ส่งแค่ 1 เกมกลับ
  } catch (error: any) {
    res.status(400).json({
      message: "Error fetching game details",
      error: error.message,
    });
  }
};

