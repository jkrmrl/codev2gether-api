import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const generateToken = (id: number, name: string, username: string): string => {
    const payload = {id, name, username};
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret, {expiresIn: '1h'});
    return token;
}

export default generateToken;