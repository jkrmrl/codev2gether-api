import { Router } from 'express';
import { createNewProject } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/create', authenticate, createNewProject);

export default router;