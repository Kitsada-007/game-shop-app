import { Request, Response } from "express";
import { cloud } from "../config/cloudconnect";
import { conn } from "../config/dbconnect";
import { CustomRequest } from "../Model/auth";



export const uploadProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { id }: any = req.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // อัปโหลด buffer ไป Cloudinary
    const result = await cloud.uploader.upload_stream(
      {
        folder: "user-folder",
        use_filename: true,
        unique_filename: false,
      },
      async (error, uploadResult) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Upload failed" });
        }

        // update ลง DB
        await conn.query("UPDATE users SET profile_image = ? WHERE id = ?", [
          uploadResult?.secure_url,
          id,
        ]);

        res.status(200).json({
          message: "Profile updated successfully",
          url: uploadResult?.secure_url,
        });
      }
    );

    // ใช้ buffer ส่งไป
    result.end(req.file.buffer);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};




export const uploadGameImages = async (req: CustomRequest, res: Response) => {
  try {
    const { game_id } = req.params; // ดึง game_id จาก body

    if (!game_id) {
      return res.status(400).json({ message: "game_id is required" });
    }

    if (!req.files || !(req.files instanceof Array)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload หลายไฟล์ขึ้น Cloudinary
    const uploadResults = await Promise.all(
      req.files.map(
        (file: Express.Multer.File) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloud.uploader.upload_stream(
              { folder: "game_images" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          })
      )
    );

    // เก็บ URL ลงใน DB
    const imageUrls = (uploadResults as any[]).map((r) => r.secure_url);

    await Promise.all(
      imageUrls.map((url) =>
        conn.query("INSERT INTO game_images (game_id, image_url) VALUES (?, ?)", [
          game_id,
          url,
        
        ])
      )
    );

    res.status(200).json({
      message: "Game images uploaded successfully",
      urls: imageUrls,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
