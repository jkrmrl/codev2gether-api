import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";
import { HTTP_STATUS } from "../constants/status.constants";
import { ERROR_MESSAGES } from "../constants/messages.constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        username: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.ACCESS_TOKEN_NOT_FOUND });
    return;
  }
  try {
    const decoded = verifyAccessToken(token) as {
      id: number;
      name: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_ACCESS_TOKEN });
    return;
  }
};
