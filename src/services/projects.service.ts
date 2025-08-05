import Project from "../models/projects.model";
import Collaborator from "../models/collaborators.model";
import Code from "../models/code.model";
import User from "../models/users.model";
import * as constants from "../constants";
import * as utils from "../utils";

export const createProject = async (
  name: string,
  description: string,
  programming_language: string,
  userId: number,
  collaborators: { username: string; access_level: string }[] = []
): Promise<Project | null> => {
  try {
    if (!name || !description || !programming_language) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.MISSING_FIELDS,
      };
    }
    const newProject = await Project.create({
      name,
      description,
      programming_language,
      owner_id: userId,
    });
    if (collaborators && collaborators.length > 0) {
      await Promise.all(
        collaborators.map(async (collaborator) => {
          const user = await User.findOne({
            where: { username: collaborator.username },
          });
          if (user) {
            return Collaborator.create({
              project_id: newProject.id,
              user_id: user.id,
              access_level: collaborator.access_level || "viewer",
            });
          } else {
            return null;
          }
        })
      );
    }
    const projectWithCollaborators = await Project.findByPk(newProject.id, {
      include: [
        {
          model: Collaborator,
          as: "collaborators",
          attributes: ["user_id", "access_level"],
        },
      ],
    });
    return projectWithCollaborators;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async (userId: number): Promise<Project[]> => {
  try {
    const ownedProjects = await Project.findAll({
      where: { owner_id: userId },
    });
    const collaboratorProjects = await Collaborator.findAll({
      where: { user_id: userId },
    });
    const projectIds = collaboratorProjects.map((collab) => collab.project_id);
    const sharedProjects = await Project.findAll({
      where: {
        id: projectIds,
      },
    });
    const projects = [...new Set([...ownedProjects, ...sharedProjects])];
    return projects;
  } catch (error) {
    throw error;
  }
};

export const saveCode = async (
  projectId: number,
  userId: number,
  codeValue: string,
  lastEditedBy: number
): Promise<Code> => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.PROJECT_NOT_FOUND,
      };
    }
    const owner = project.owner_id === userId;
    const editor = await Collaborator.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
        access_level: "editor",
      },
    });
    if (!owner && !editor) {
      throw {
        status: constants.HTTP_STATUS.FORBIDDEN,
        message: constants.ERROR_MESSAGES.FORBIDDEN,
      };
    }
    const code = await Code.create({
      project_id: projectId,
      user_id: userId,
      code_value: codeValue,
      last_edited_by: lastEditedBy,
    });
    return code;
  } catch (error) {
    throw error;
  }
};

export const getProject = async (
  projectId: number,
  userId: number
): Promise<Project> => {
  try {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Code,
          as: "codes",
          include: [{ model: User, as: "user" }],
        },
        {
          model: Collaborator,
          as: "collaborators",
          include: [{ model: User, as: "user" }],
        },
        {
          model: User,
          as: "owner",
        },
      ],
    });
    if (!project) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.PROJECT_NOT_FOUND,
      };
    }
    if (project.owner_id !== userId) {
      const collaborator = await Collaborator.findOne({
        where: { project_id: projectId, user_id: userId },
      });
      if (!collaborator) {
        throw {
          status: constants.HTTP_STATUS.FORBIDDEN,
          message: constants.ERROR_MESSAGES.FORBIDDEN,
        };
      }
    }
    return project;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  userId: number,
  name: string,
  description: string,
  programming_language: string,
  collaborators: {
    username: string;
    access_level?: string;
    action: "add" | "edit" | "remove";
  }[] = []
): Promise<Project | null> => {
  try {
    if (!name || !description || !programming_language) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.MISSING_FIELDS,
      };
    }
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.PROJECT_NOT_FOUND,
      };
    }
    if (project.owner_id !== userId) {
      throw {
        status: constants.HTTP_STATUS.FORBIDDEN,
        message: constants.ERROR_MESSAGES.FORBIDDEN,
      };
    }
    await project.update({
      name,
      description,
      programming_language,
    });
    if (collaborators && collaborators.length > 0) {
      await Promise.all(
        collaborators.map(async (collaboratorData) => {
          const { username, access_level, action } = collaboratorData;
          const user = await User.findOne({ where: { username } });
          if (user) {
            const existingCollaborator = await Collaborator.findOne({
              where: {
                project_id: projectId,
                user_id: user.id,
              },
            });
            if (action === "add" && !existingCollaborator) {
              await Collaborator.create({
                project_id: projectId,
                user_id: user.id,
                access_level: access_level || "viewer",
              });
            } else if (action === "edit" && existingCollaborator) {
              if (access_level) {
                await existingCollaborator.update({ access_level });
              }
            } else if (action === "remove" && existingCollaborator) {
              await Collaborator.destroy({
                where: {
                  project_id: projectId,
                  user_id: user.id,
                },
              });
            }
          } else {
            return null;
          }
        })
      );
    }
    const updatedProject = await Project.findByPk(projectId, {
      include: [
        {
          model: Collaborator,
          as: "collaborators",
          attributes: ["user_id", "access_level"],
        },
      ],
    });
    return updatedProject;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (
  projectId: number,
  userId: number
): Promise<void> => {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.PROJECT_NOT_FOUND,
      };
    }
    if (project.owner_id !== userId) {
      throw {
        status: constants.HTTP_STATUS.FORBIDDEN,
        message: constants.ERROR_MESSAGES.FORBIDDEN,
      };
    }
    await Project.sequelize?.transaction(async (t) => {
      await Collaborator.destroy({
        where: { project_id: projectId },
        transaction: t,
      });
      await Code.destroy({
        where: { project_id: projectId },
        transaction: t,
      });
      await Project.destroy({
        where: { id: projectId },
        transaction: t,
      });
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const executeCode = async (
  projectId: number,
  codeValue: string,
  userId: number
) => {
  try {
    if (!codeValue) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.MISSING_FIELDS,
      };
    }
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw {
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.PROJECT_NOT_FOUND,
      };
    }
    const owner = project.owner_id === userId;
    const editor = await Collaborator.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
        access_level: "editor",
      },
    });
    if (!owner && !editor) {
      throw {
        status: constants.HTTP_STATUS.FORBIDDEN,
        message: constants.ERROR_MESSAGES.FORBIDDEN,
      };
    }
    const judge0LanguageId = utils.getJudge0LanguageId(
      project.programming_language
    );
    if (!judge0LanguageId) {
      throw {
        status: constants.HTTP_STATUS.BAD_REQUEST,
        message: constants.ERROR_MESSAGES.UNSUPPORTED_LANGUAGE,
      };
    }
    const executionResult = await utils.executeCodeOnJudge0(
      judge0LanguageId,
      codeValue
    );
    return executionResult;
  } catch (error) {
    throw error;
  }
};
