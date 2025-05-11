import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (
  id: number,
  name: string,
  username: string
): string => {
  const payload = { id, name, username };
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return token;
};

export const generateRefreshToken = (
  id: number,
  name: string,
  username: string
): string => {
  const payload = { id, name, username };
  const secret = process.env.REFRESH_TOKEN_SECRET as string;
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "1d" });
  return refreshToken;
};

export const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret);
};

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
  const secret = process.env.REFRESH_TOKEN_SECRET as string;
  return jwt.verify(token, secret);
};
