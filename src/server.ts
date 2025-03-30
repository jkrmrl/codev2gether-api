import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/users.route';
import projectsRoutes from './routes/projects.route';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
