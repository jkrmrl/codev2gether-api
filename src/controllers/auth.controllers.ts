import { Request, Response } from "express";
import * as services from "../services";
import * as constants from "../constants";
import * as utils from "../utils";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password } = req.body;
    const user = await services.registerUser(name, username, password);
    if (!user) {
      res
        .status(constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: constants.ERROR_MESSAGES.INTERNAL_ERROR });
    }
    const accessToken = utils.generateAccessToken(
      user.id,
      user.name,
      user.username
    );
    const refreshToken = utils.generateRefreshToken(
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
    res.status(constants.HTTP_STATUS.CREATED).json({
      message: constants.SUCCESS_MESSAGES.REGISTER_SUCCESS,
      accessToken,
    });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await services.loginUser(username, password);
    if (!user) {
      res
        .status(constants.HTTP_STATUS.UNAUTHORIZED)
        .json({ message: constants.ERROR_MESSAGES.INTERNAL_ERROR });
    }
    const accessToken = utils.generateAccessToken(
      user.id,
      user.name,
      user.username
    );
    const refreshToken = utils.generateRefreshToken(
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
      .status(constants.HTTP_STATUS.OK)
      .json({ message: constants.SUCCESS_MESSAGES.LOGIN_SUCCESS, accessToken });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(constants.HTTP_STATUS.UNAUTHORIZED)
      .json({ message: constants.ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND });
  }
  try {
    const decoded = utils.verifyRefreshToken(refreshToken) as {
      id: number;
      name: string;
      username: string;
    };
    const newAccessToken = utils.generateAccessToken(
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
      .status(constants.HTTP_STATUS.UNAUTHORIZED)
      .json({ message: constants.ERROR_MESSAGES.INVALID_REFRESH_TOKEN });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    res
      .status(constants.HTTP_STATUS.OK)
      .json({ message: constants.SUCCESS_MESSAGES.LOGOUT_SUCCESS });
  } catch (error: any) {
    console.error("Error during logout:", error);
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.LOGOUT_FAILURE,
      });
  }
};
