import bcrypt from 'bcryptjs';
import User from '../models/users.model';
import generateToken from '../utils/token';

export const registerUser = async (name: string, username: string, password: string) => {
  try {

    if (!name || !username || !password) {
        throw new Error('All input fields must not be empty');
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) throw new Error('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, username, password: hashedPassword });

    const token = generateToken(newUser.id, newUser.name, newUser.username);

    return { token };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};
