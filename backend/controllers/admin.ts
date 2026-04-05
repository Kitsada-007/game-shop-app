import { Request, Response } from "express";
import { conn } from "../config/dbconnect";
import { GameReq, GameRes } from "../Model/game";
import { PromoReq } from "../Model/promo";



export const users = async (req: Request, res:Response) => {
  try {
        const [result] =  await conn.query('SELECT * FROM users')
        res.status(200).json(result)
  } catch (error) {
        res.status(400).json(
          {
            massges: "error"
          }
        )
  }
}


export const createGame = async (req: Request, res: Response) => {
  try {
    // CreateGame
    const game: GameReq = req.body;
    if (!game.name || !game.price || !game.genre || !game.description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `
      INSERT INTO games (name, price, genre, description) 
      VALUES (?, ?, ?, ?)
    `;

    const [result]: any = await conn.query(sql, [
      game.name,
      game.price,
      game.genre,
      game.description,
    ]);

    res.status(201).json({
      message: "Game created successfully",
      affected_row: result.affectedRows,
      last_idx: result.insertId,
    });
  } catch (error: any) {
    console.error("Error creating game:", error.message);
    res.status(500).json({
      message: "Error creating game",
      error: error.message,
    });
  }
};

export const editGame = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const game: GameReq = req.body;

    // 1. select ข้อมูลเดิมจาก DB
    let sql = "SELECT * FROM games WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);
    const result = rows as GameRes[];

    if (result.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    // 2. merge ข้อมูลใหม่กับข้อมูลเดิม
    const gameOriginal = result[0];
    const updateGame = { ...gameOriginal, ...game };

    // 3. update DB
    sql = `
      UPDATE games 
      SET name = ?, price = ?, genre = ?, description = ? 
      WHERE id = ?`;

    const [updateResult]: any = await conn.query(sql, [
      updateGame.name,
      updateGame.price,
      updateGame.genre,
      updateGame.description,
      id,
    ]);

    // 4. response กลับ
    res.status(200).json({
      message: "Game updated successfully",
      affected_row: updateResult.affectedRows,
      updatedGame: updateGame, 
    });

  } catch (error: any) {
    console.error("Error updating game:", error.message);
    res.status(500).json({
      message: "Error updating game",
      error: error.message,
    });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await conn.query("DELETE FROM games WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ affected_row: result.affectedRows });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Database error" });
  }
};

export const read = async (req: Request, res: Response) => {
  try {
    const [result] = await conn.query("SELECT * FROM promo_codes")

    res.status(200).json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const createPromo = async (req: Request, res: Response) => {
   try {
    const promo: PromoReq = req.body;
    if (!promo.code || !promo.discount_percent || !promo.max_uses) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `
      INSERT INTO promo_codes (code, discount_percent, max_uses) 
      VALUES (?, ?, ?)
    `;

    const [result]: any = await conn.query(sql, [
        promo.code,
        promo.discount_percent,
        promo.max_uses
    ]);

    res.status(201).json({
      message: "Promo created successfully",
      affected_row: result.affectedRows,
      last_idx: result.insertId,
    });
  } catch (error: any) {
    console.error("Error creating promo:", error.message);
    res.status(500).json({
      message: "Error creating promo",
      error: error.message,
    });
  }
};
export const editPromo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const promo: PromoReq = req.body;

    

    // 1. select ของเดิม
    let sql = "SELECT * FROM promo_codes WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);
    const result = rows as PromoReq[];

    if (result.length === 0) {
      return res.status(404).json({ message: "Promo not found" });
    }

    // 2. merge ของเก่ากับของใหม่
    const promoOriginal = result[0];
    const updatePromo = { ...promoOriginal, ...promo };

    // 3. update DB
    sql = `
      UPDATE promo_codes 
      SET code = ?, discount_percent = ?, max_uses = ? 
      WHERE id = ?`;
      
    const [updateResult]: any = await conn.query(sql, [
      updatePromo.code,
      updatePromo.discount_percent,
      updatePromo.max_uses,
      id,
    ]);

    // 4. response
    res.status(200).json({
      message: "Promo updated successfully",
      affected_row: updateResult.affectedRows,
      updatedPromo: updatePromo,
    });

  } catch (error: any) {
    console.error("Error updating promo:", error.message);
    res.status(500).json({
      message: "Error updating promo",
      error: error.message,
    });
  }
};

export const deletePromo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await conn.query("DELETE FROM promo_codes  WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "promo not found" });
    }

    res.status(200).json({ affected_row: result.affectedRows });
  } catch (error) {
    console.error("Error deleting promo:", error);
    res.status(500).json({ error: "Database error" });
  }
};
