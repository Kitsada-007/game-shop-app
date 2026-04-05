import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
export interface UserPostRequest {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  password: string;
  wallet?: number;
}

export interface CustomRequest extends Request {
  user?: string | JwtPayload ; 
}