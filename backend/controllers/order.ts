import { Request, Response } from "express";
import { conn } from "../config/dbconnect";
import { CustomRequest } from "../Model/auth";


export const createOrder = async (req: CustomRequest, res: Response) => {

  
  try {
    const { id }: any = req.user;
    const { games, promo_code } = req.body; // games = [1,2,3] หรือ [1]

    if (!games || games.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "เลือกเกมอย่างน้อย 1 เกม" });
    }

    // 1) ตรวจสอบว่าเกมที่ซื้อแล้ว
    const [ownedGames]: any = await conn.query(
      "SELECT game_id FROM user_games WHERE user_id = ?",
      [id]
    );
    const ownedGameIds = ownedGames.map((g: any) => g.game_id);

    const newGames = games.filter((gameId: number) => !ownedGameIds.includes(gameId));
    if (newGames.length === 0) {
    
      return res
        .status(400)
        .json({ success: false, message: "คุณมีเกมเหล่านี้แล้ว" });
    }

    // 2) ดึงราคาเกม
    const [gameRows]: any = await conn.query(
      "SELECT id, name, price FROM games WHERE id IN (?)",
      [newGames]
    );

    if (gameRows.length === 0) {
      
      return res
        .status(404)
        .json({ success: false, message: "ไม่พบเกมที่เลือก" });
    }

    let totalPrice = gameRows.reduce(
      (sum: number, g: any) => sum + parseFloat(g.price),
      0
    );

    let discount = 0;
    let promoCodeId = null;

    // 3) ตรวจสอบและใช้โค้ดส่วนลด
    if (promo_code) {
      const [promo]: any = await conn.query(
        "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1",
        [promo_code]
      );

      if (promo.length === 0) {
    
        return res
          .status(400)
          .json({ success: false, message: "โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ" });
      }

      const promoData = promo[0];

      // ตรวจสอบว่าโค้ดยังใช้ได้หรือไม่
      if (promoData.current_uses >= promoData.max_uses) {
      
        return res
          .status(400)
          .json({ success: false, message: "โค้ดส่วนลดถูกใช้หมดแล้ว" });
      }

      // ตรวจสอบว่าผู้ใช้เคยใช้โค้ดนี้แล้วหรือไม่
      const [usedPromo]: any = await conn.query(
        "SELECT * FROM user_promo_usage WHERE user_id = ? AND promo_code_id = ?",
        [id, promoData.id]
      );

      if (usedPromo.length > 0) {
       
        return res
          .status(400)
          .json({ success: false, message: "คุณเคยใช้โค้ดส่วนลดนี้แล้ว" });
      }

      const discountPercent = parseFloat(promoData.discount_percent);
      discount = (totalPrice * discountPercent) / 100;
      promoCodeId = promoData.id;
    }

    const finalPrice = totalPrice - discount;

    // 4) ตรวจสอบยอดเงินในกระเป๋า
    const [userWallet]: any = await conn.query(
      "SELECT wallet_balance FROM users WHERE id = ?",
      [id]
    );

    const walletBalance = parseFloat(userWallet[0].wallet_balance);

    if (walletBalance < finalPrice) {
     
      return res.status(400).json({
        success: false,
        message: `ยอดเงินไม่เพียงพอ คุณมีเงิน ${walletBalance.toFixed(2)} บาท แต่ต้องชำระ ${finalPrice.toFixed(2)} บาท`,
      });
    }

    // 5) หักเงินจากกระเป๋า
    await conn.query(
      "UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?",
      [finalPrice, id]
    );

    // 6) สร้าง order
    const [orderResult]: any = await conn.query(
      "INSERT INTO orders (user_id, total_price, discount, final_price, promo_code) VALUES (?, ?, ?, ?, ?)",
      [id, totalPrice, discount, finalPrice, promo_code || null]
    );
    const orderId = orderResult.insertId;

    // 7) เพิ่ม order_items และ user_games
    for (let g of gameRows) {
      await conn.query(
        "INSERT INTO order_items (order_id, game_id, price) VALUES (?, ?, ?)",
        [orderId, g.id, g.price]
      );
      await conn.query(
        "INSERT INTO user_games (user_id, game_id) VALUES (?, ?)",
        [id, g.id]
      );
    }

    // 8) อัปเดต total_sales ของเกม
    for (let g of gameRows) {
      await conn.query(
        "UPDATE games SET total_sales = total_sales + 1 WHERE id = ?",
        [g.id]
      );
    }

    // 9) เพิ่ม Transaction
    const gameNames = gameRows.map((g: any) => g.name).join(", ");
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, order_id, description) VALUES (?, 'purchase', ?, ?, ?)",
      [id, finalPrice, orderId, `ซื้อเกม: ${gameNames}`]
    );

    // 10) บันทึกการใช้โค้ดส่วนลดและอัปเดตจำนวนครั้งที่ใช้
    if (promoCodeId) {
      await conn.query(
        "INSERT INTO user_promo_usage (user_id, promo_code_id) VALUES (?, ?)",
        [id, promoCodeId]
      );
      await conn.query(
        "UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = ?",
        [promoCodeId]
      );
    }



    // ดึงยอดเงินคงเหลือใหม่
    const [updatedUser]: any = await conn.query(
      "SELECT wallet_balance FROM users WHERE id = ?",
      [id]
    );

    res.status(201).json({
      success: true,
      message: "ซื้อเกมสำเร็จ",
      order_id: orderId,
      total_price: totalPrice,
      discount: discount,
      final_price: finalPrice,
      remaining_balance: parseFloat(updatedUser[0].wallet_balance),
      games_purchased: gameRows.map((g: any) => ({
        id: g.id,
        name: g.name,
        price: g.price
      }))
    });
  } catch (error) {
  
    console.error(error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  } 
};