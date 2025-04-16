import bcrypt from 'bcryptjs';
import User from '../models/users.model';
import generateToken from '../utils/token';

export const registerUser = async (name: string, username: string, password: string) => {

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, username, password: hashedPassword });

    const token = generateToken(newUser.id, newUser.name, newUser.username);

    return { token };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }

};

export const loginUser = async (username: string, password: string) => {

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id, user.name, user.username);

    return { token };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred during login');
  }

};