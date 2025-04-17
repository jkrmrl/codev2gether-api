import bcrypt from "bcryptjs";
import User from "../models/users.model";
import generateToken from "../utils/token";
import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants";

export const registerUser = async (
  name: string,
  username: string,
  password: string
) => {
  return Promise.resolve()
    .then(() => {
      if (!name || !username || !password) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        };
      }
      return User.findOne({ where: { username } });
    })
    .then(async (user) => {
      if (user) {
        throw {
          status: HTTP_STATUS.CONFLICT,
          message: ERROR_MESSAGES.USER_EXISTS,
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        username,
        password: hashedPassword,
      });
      return generateToken(newUser.id, newUser.name, newUser.username);
    })
    .then((token) => {
      return { token };
    })
    .catch((error) => {
      throw error;
    });
};

export const loginUser = async (username: string, password: string) => {
  return Promise.resolve()
    .then(() => {
      if (!username || !password) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        };
      }
      return User.findOne({ where: { username } });
    })
    .then(async (user) => {
      if (!user) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        };
      }
      const isValid = await bcrypt.compare(password, user.password);
      return { user, isValid };
    })
    .then(({ user, isValid }) => {
      if (!isValid) {
        throw {
          status: HTTP_STATUS.UNAUTHORIZED,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }
      return generateToken(user.id, user.name, user.username);
    })
    .then((token) => {
      return { token };
    })
    .catch((error) => {
      throw error;
    });
};
