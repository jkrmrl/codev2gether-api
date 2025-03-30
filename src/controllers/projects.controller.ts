import { Request, Response } from 'express';
import { createProject } from '../services/projects.service'; 

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