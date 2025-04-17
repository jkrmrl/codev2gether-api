import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/users.service";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../utils/constants";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password } = req.body;
    const { token } = await registerUser(name, username, password);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: SUCCESS_MESSAGES.REGISTER_SUCCESS, token });
  } catch (error: any) {
    res.status(error?.status).json({ message: error?.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const { token } = await loginUser(username, password);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.LOGIN_SUCCESS, token });
  } catch (error: any) {
    res.status(error?.status).json({ message: error?.message });
  }
};
