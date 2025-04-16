import { Request, Response } from 'express';
import { createProject, getProjects, saveCode, getProject } from '../services/projects.service'; 

export const createNewProject = async (req: Request, res: Response): Promise<void> => { 

    const { name, description, programming_language, collaborators } = req.body;
    const owner_id = req.user?.id;

    if (!name || !description || !programming_language) {
      res.status(400).json({ message: 'All fields must be entered' });
      return;
    }

    if (!owner_id) {
        res.status(401).json({ message: 'User ID not found in token' });
        return;
    }

    try {
        const project = await createProject(
            name,
            description,
            programming_language,
            owner_id,
            collaborators
        );

        res.status(201).json({ message: 'Project created successfully', project }); 
        return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }

};

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {

    const userId = req.user?.id; 

    if (!userId) {
        res.status(401).json({ message: 'User ID not found in token' });
        return;
    }

    try {
        const projects = await getProjects(userId);
        res.status(200).json({ projects });
        return;
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        return;
    }

};

export const saveProjectCode = async (req: Request, res: Response): Promise<void> => {

    const { code_value } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id;
  
    if (!userId) {
      res.status(401).json({ message: 'User ID not found in token' });
      return;
    }
  
    if (!projectId) {
      res.status(400).json({ message: 'Project ID is required.' });
      return;
    }
  
    try {
      const savedCode = await saveCode(
        projectId,
        userId,
        code_value,
        userId 
      );
  
      res.status(201).json({ message: 'Code saved successfully', savedCode });
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }

};

export const getProjectDetails = async (req: Request, res: Response): Promise<void> => {

    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id; 

    if (!userId) {
      res.status(401).json({ message: 'User ID not found in token' });
      return;
    }

    try {
      const project = await getProject(projectId, userId);
  
      if (!project) {
        res.status(403).json({ message: 'User is not authorized to view this project' }); 
        return;
      }
  
      res.status(200).json(project);
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }

};