import { Request, Response } from "express";
import { conn } from "../config/dbconnect";



export const read = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await conn.query(`
      SELECT 
        g.id,
        g.name,
        g.price,
        g.genre,
        g.description,
        g.total_sales,
        g.release_date,
        g.created_at,
        g.updated_at,
        COALESCE(GROUP_CONCAT(gi.image_url ORDER BY gi.is_primary DESC SEPARATOR ','), '') AS images
      FROM games g
      LEFT JOIN game_images gi ON g.id = gi.game_id
      GROUP BY 
        g.id, g.name, g.price, g.genre, g.description, 
        g.total_sales, g.release_date, g.created_at, g.updated_at
      ORDER BY g.created_at DESC;
    `);

    // แปลง images จาก string → array
    const formatted = rows.map((game: any) => ({
      ...game,
      images: game.images ? game.images.split(',') : []
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Failed to fetch games" });
  }
};


export const readById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await conn.query(
      `
      SELECT 
        g.id,
        g.name,
        g.price,
        g.genre,
        g.description,
        g.total_sales,
        g.release_date,
        g.created_at,
        g.updated_at,
        COALESCE(GROUP_CONCAT(gi.image_url ORDER BY gi.is_primary DESC SEPARATOR ','), '') AS images
      FROM games g
      LEFT JOIN game_images gi ON g.id = gi.game_id
      WHERE g.id = ?
      GROUP BY 
        g.id, g.name, g.price, g.genre, g.description, 
        g.total_sales, g.release_date, g.created_at, g.updated_at
      LIMIT 1;
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    // แปลง images เป็น array
    const game = {
      ...rows[0],
      images: rows[0].images ? rows[0].images.split(",") : [],
    };

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game by ID:", error);
    res.status(500).json({ message: "Failed to fetch game" });
  }
};

export const handleName = async (req: Request, res: Response, query:string) => {
  try {
    const [result] = await conn.query(
      "SELECT * FROM games WHERE name LIKE ?",
      ["%" + query + "%"]
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};
export const handleGenre = async (req: Request, res: Response, query: string) => {
   try {
 
    const [games]: any = await conn.query(
      "SELECT * FROM games WHERE genre = ?",
      [query]
    );

    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    // Query จาก VIEW แทน table
    const [result] = await conn.query("SELECT * FROM top_games");

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// searchfilters
export const searchfilters = (req: Request, res: Response) =>{
   try{
       
        const { name,  Genre } = req.body;
        if (name) {
            console.log("Search name:", name);
            handleName(req, res, name);
        }
        if (Genre) {
            console.log("Search Genre:", Genre);
            handleGenre(req, res, Genre);
        } 
    }catch(error){
        res.status(500).json({
            message: "Server Error"
        });
    }
}