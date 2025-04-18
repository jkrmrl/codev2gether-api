import Project from "../models/projects.model";
import Collaborator from "../models/collaborators.model";
import Code from "../models/code.model";
import User from "../models/users.model";
import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants";

export const createProject = async (
  name: string,
  description: string,
  programming_language: string,
  owner_id: number,
  collaborators: { user_id: number; access_level: string }[] = []
) => {
  return Promise.resolve()
    .then(async () => {
      if (!name || !description || !programming_language || !owner_id) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        };
      }
      const newProject = await Project.create({
        name,
        description,
        programming_language,
        owner_id,
      });
      return newProject;
    })
    .then(async (newProject) => {
      if (collaborators && collaborators.length > 0) {
        await Promise.all(
          collaborators.map((collaborator) =>
            Collaborator.create({
              project_id: newProject.id,
              user_id: collaborator.user_id,
              access_level: collaborator.access_level || "viewer",
            })
          )
        );
      }
      return Project.findByPk(newProject.id, {
        include: [
          {
            model: Collaborator,
            as: "collaborators",
            attributes: ["user_id", "access_level"],
          },
        ],
      });
    })
    .then((newProject) => {
      return newProject;
    })
    .catch((error) => {
      throw error;
    });
};

export const getProjects = async (userId: number) => {
  return Promise.resolve()
    .then(async () => {
      if (!userId) {
        throw {
          status: HTTP_STATUS.UNAUTHORIZED,
          message: ERROR_MESSAGES.MISSING_USER_ID,
        };
      }
      return await Project.findAll({ where: { owner_id: userId } });
    })
    .then(async (projects1) => {
      const collaboratorProjects = await Collaborator.findAll({
        where: { user_id: userId },
      });
      const projectIds = collaboratorProjects.map(
        (collab) => collab.project_id
      );
      const projects2 = await Project.findAll({
        where: {
          id: projectIds,
        },
      });
      const projects = [...new Set([...projects1, ...projects2])];
      return projects;
    })
    .catch((error) => {
      throw error;
    });
};

export const saveCode = async (
  projectId: number,
  userId: number,
  codeValue: string,
  lastEditedBy: number
) => {
  return Promise.resolve()
    .then(async () => {
      const project = await Project.findByPk(projectId);
      if (!project) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        };
      }
      return project;
    })
    .then(async (project) => {
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
          status: HTTP_STATUS.FORBIDDEN,
          message: ERROR_MESSAGES.FORBIDDEN,
        };
      }
      return await Code.create({
        project_id: projectId,
        user_id: userId,
        code_value: codeValue,
        last_edited_by: lastEditedBy,
      });
    })
    .then((code) => code)
    .catch((error) => {
      throw error;
    });
};

export const getProject = async (projectId: number, userId: number) => {
  return Project.findByPk(projectId, {
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
  })
    .then((project) => {
      if (!project) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        };
      }
      if (project.owner_id !== userId) {
        return Collaborator.findOne({
          where: { project_id: projectId, user_id: userId },
        }).then((collaborator) => {
          if (!collaborator) {
            throw {
              status: HTTP_STATUS.FORBIDDEN,
              message: ERROR_MESSAGES.FORBIDDEN,
            };
          }
          return project;
        });
      }
      return project;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateProject = async (
  projectId: number,
  userId: number,
  name: string,
  description: string,
  programming_language: string,
  collaborators: {
    id: number;
    access_level?: string;
    action: "add" | "edit" | "remove";
  }[] = []
) => {
  return Promise.resolve()
    .then(() => {
      if (!name || !description || !programming_language) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        };
      }
      return Project.findByPk(projectId);
    })
    .then((project) => {
      if (!project) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        };
      }
      if (project.owner_id !== userId) {
        throw {
          status: HTTP_STATUS.FORBIDDEN,
          message: ERROR_MESSAGES.FORBIDDEN,
        };
      }
      project.update({
        name,
        description,
        programming_language,
      });
    })
    .then(async () => {
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
            if (action === "add" && !existingCollaborator) {
              await Collaborator.create({
                project_id: projectId,
                user_id: id,
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
                  user_id: id,
                },
              });
            }
          })
        );
      }
    })
    .then(() => {
      return Project.findByPk(projectId, {
        include: [
          {
            model: Collaborator,
            as: "collaborators",
            attributes: ["user_id", "access_level"],
          },
        ],
      });
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteProject = async (projectId: number, userId: number) => {
  return Project.findByPk(projectId)
    .then((project) => {
      if (!project) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
        };
      }
      if (project.owner_id !== userId) {
        throw {
          status: HTTP_STATUS.FORBIDDEN,
          message: ERROR_MESSAGES.FORBIDDEN,
        };
      }
      Project.sequelize?.transaction(async (t) => {
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
    })
    .then(() => {
      return;
    })
    .catch((error) => {
      throw error;
    });
};
