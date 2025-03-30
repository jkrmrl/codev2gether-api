import Project from '../models/projects.model';
import Collaborator from '../models/collaborators.model';

export const createProject = async (
    name: string,
    description: string,
    programming_language: string,
    owner_id: number,
    collaborators: { user_id: number; access_level: string }[] = [] 
) => {
    try {
        if (!name || !description || !programming_language) {
            throw new Error('Enter necessary input fields');
        }

        const newProject = await Project.create({
            name,
            description,
            programming_language,
            owner_id,
        });

        if (collaborators && collaborators.length > 0) {
            await Promise.all(
                collaborators.map((collaborator) =>
                    Collaborator.create({
                        project_id: newProject.id,
                        user_id: collaborator.user_id,
                        access_level: collaborator.access_level, 
                    })
                )
            );
        }

        return newProject;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};

export const getProjects = async (userId: number) => {
    try {
        const projects1 = await Project.findAll({ where: { owner_id: userId } });

        const collaboratorProjects = await Collaborator.findAll({
            where: { user_id: userId },
        });

        const projectIds = collaboratorProjects.map((collab) => collab.project_id);

        const projects2 = await Project.findAll({
            where: {
                id: projectIds
            }
        });

        const projects = [...new Set([...projects1, ...projects2])];

        return projects;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
};