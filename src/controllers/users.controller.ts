import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/users.service';

export const register = async (req: Request, res: Response): Promise<void> => {

  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    res.status(400).json({ message: 'All fields must be entered' });
    return;
  }

  try {
    const { token } = await registerUser(name, username, password);
    res.status(201).json({ message: 'User registered successfully', token });
    return;
  } catch (error: any) {
    if (error.message === 'Username already exists') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Registration failed due to a server error' });
    }
    return;
  }

};

export const login = async (req: Request, res: Response): Promise<void> => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    const { token } = await loginUser(username, password);
    res.status(200).json({ message: 'Login successful', token });
    return;
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Invalid credentials') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Login failed due to a server error' });
    }
    return;
  }

};