import { Request, Response } from "express";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan"

import userRouter from "./Routes/user";
import authRouter from "./Routes/auth";
import gameRouter from "./Routes/game";
import adminRouter from "./Routes/admin";

import orderRouter from "./Routes/order";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(morgan('dev'));
app.use(cors());
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", gameRouter);
app.use("/api", adminRouter);
app.use("/api", orderRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "404 not found",
  });
});
