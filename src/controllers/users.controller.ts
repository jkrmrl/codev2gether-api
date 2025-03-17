import { Request, Response } from 'express';
import { registerUser } from '../services/users.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, username, password } = req.body;
  
    try {
      const { token } = await registerUser(name, username, password);
      res.status(201).json({ message: 'User registered successfully', token });
      return;
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
};