import { Router } from 'express';
import { createNewProject } from '../controllers/projects.controller';
import { getAllProjects } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createNewProject);
router.get('/', authenticate, getAllProjects);

export default router;