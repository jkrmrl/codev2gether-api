import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/users.route';
import projectsRoutes from './routes/projects.route';
import Project from './models/projects.model';
import User from './models/users.model';
import Collaborator from './models/collaborators.model';
import Code from './models/code.model';

const models = { Project, User, Collaborator, Code };

Object.values(models)
  .filter((model: any) => typeof model.associate === 'function')
  .forEach((model: any) => model.associate(models));

dotenv.config();

const app = express();
app.use(bodyParser.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
