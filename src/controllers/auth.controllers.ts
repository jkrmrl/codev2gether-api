import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.services";
import { HTTP_STATUS } from "../constants/status.constants";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../constants/messages.constants";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password } = req.body;
    const user = await registerUser(name, username, password);
    if (!user) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
    }
    const accessToken = generateAccessToken(user.id, user.name, user.username);
    const refreshToken = generateRefreshToken(
      user.id,
      user.name,
      user.username
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: SUCCESS_MESSAGES.REGISTER_SUCCESS, accessToken });
  } catch (error: any) {
    res.status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    if (!user) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
    }
    const accessToken = generateAccessToken(user.id, user.name, user.username);
    const refreshToken = generateRefreshToken(
      user.id,
      user.name,
      user.username
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.LOGIN_SUCCESS, accessToken });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken) as {
      id: number;
      name: string;
      username: string;
    };
    const newAccessToken = generateAccessToken(
      decoded.id,
      decoded.name,
      decoded.username
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
  }
};
