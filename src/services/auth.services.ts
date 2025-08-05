import bcrypt from "bcryptjs";
import User from "../models/users.model";
import * as constants from "../constants";

export const registerUser = async (
  name: string,
  username: string,
  password: string
): Promise<User> => {
  try {
    if (!name || !username || !password) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.MISSING_FIELDS,
      };
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw {
        status: constants.HTTP_STATUS.CONFLICT,
        message: constants.ERROR_MESSAGES.UNAVAILABLE_USERNAME,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  try {
    if (!username || !password) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.MISSING_FIELDS,
      };
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw {
        status: constants.HTTP_STATUS.UNAUTHORIZED,
        message: constants.ERROR_MESSAGES.INVALID_CREDENTIALS,
      };
    }
    return user;
  } catch (error) {
    throw error;
  }
};
