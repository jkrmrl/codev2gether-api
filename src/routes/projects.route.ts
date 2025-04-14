import { Router } from 'express';
import { createNewProject, getAllProjects, saveProjectCode, getProjectDetails } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createNewProject);
router.get('/', authenticate, getAllProjects);
router.post('/:projectId', authenticate, saveProjectCode);
router.get('/:projectId', authenticate, getProjectDetails);

export default router;