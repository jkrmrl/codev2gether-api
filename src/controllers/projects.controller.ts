import { Request, Response } from 'express';
import { createProject } from '../services/projects.service'; 
import { getProjects } from '../services/projects.service';

export const createNewProject = async (req: Request, res: Response): Promise<void> => { 
    const { name, description, programming_language, collaborators } = req.body;

    try {
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ message: 'User ID not found in token' });
            return;
        }

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
        res.status(400).json({ message: error.message });
        return;
    }
};

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; 

        if (!userId) {
            res.status(401).json({ message: 'User ID not found in token' });
            return;
        }

        const projects = await getProjects(userId);
        res.status(200).json({ projects });
        return;
    } catch (error: any) {
        res.status(400).json({ message: error.message });
        return;
    }
};