import Project from '../models/projects.model';
import Collaborator from '../models/collaborators.model';
import Code from '../models/code.model';
import User from '../models/users.model';
import { Op } from 'sequelize';

export const createProject = async (
    name: string,
    description: string,
    programming_language: string,
    owner_id: number,
    collaborators: { user_id: number; access_level: string }[] = [] 
) => {

    try {
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
    } catch (error: any) {
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

export const saveCode = async (
    projectId: number,
    userId: number,
    codeValue: string,
    lastEditedBy: number
  ) => {

    try {
      const newCode = await Code.create({
        project_id: projectId,
        user_id: userId,
        code_value: codeValue,
        last_edited_by: lastEditedBy
      });
      return newCode;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }

};

let associationsDefined = false;

export const getProject = async (projectId: number, userId: number) => {

  try {
    if (!associationsDefined) {
      Project.hasMany(Code, { foreignKey: 'project_id', as: 'codes' });
      Project.hasMany(Collaborator, { foreignKey: 'project_id', as: 'collaborators' });
      Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
      Code.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
      Collaborator.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

      associationsDefined = true;
    }

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Code,
          as: 'codes',
          include: [{ model: User, as: 'user' }],
        },
        {
          model: Collaborator,
          as: 'collaborators',
          include: [{ model: User, as: 'user' }],
        },
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    if (!project) {
      return null;
    }

    if (project.owner_id !== userId) {
      const collaborator = await Collaborator.findOne({
        where: { project_id: projectId, user_id: userId },
      });

      if (!collaborator) {
        return null; 
      }
    }

    return project;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
  }

};

export const updateProject = async (
    projectId: number,
    userId: number, 
    name: string,
    description: string,
    programming_language: string,
    collaborators: { id: number; access_level?: string; action: 'add' | 'edit' | 'remove' }[] = []
  ) => {
    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        if (project.owner_id !== userId) {
            throw new Error('You are not the owner of this project and cannot edit it');
        }

        await project.update({
            name,
            description,
            programming_language,
        });

        if (collaborators && collaborators.length > 0) {
            await Promise.all(
                collaborators.map(async (collaboratorData) => {
                    const { id, access_level, action } = collaboratorData;

                    const existingCollaborator = await Collaborator.findOne({
                        where: {
                            project_id: projectId,
                            user_id: id,
                        },
                    });

                    if (action === 'add' && !existingCollaborator) {
                        await Collaborator.create({
                            project_id: projectId,
                            user_id: id,
                            access_level: access_level || 'viewer',
                        });
                    } else if (action === 'edit' && existingCollaborator) {
                        if (access_level) {
                            await existingCollaborator.update({ access_level });
                        }
                    } else if (action === 'remove' && existingCollaborator) {
                        await Collaborator.destroy({
                            where: {
                                project_id: projectId,
                                user_id: id,
                            },
                        });
                    }
                })
            );
        }

        const updatedProject = await Project.findByPk(projectId, {
            include: [{
                model: Collaborator,
                as: 'collaborators',
                attributes: ['user_id', 'access_level'],
            }],
        });

        return updatedProject;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred while updating the project');
    }
};