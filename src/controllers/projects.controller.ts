import { Request, Response } from "express";
import {
  createProject,
  getProjects,
  saveCode,
  getProject,
  updateProject,
  deleteProject,
  executeCode,
} from "../services/projects.service";
import { HTTP_STATUS } from "../constants/status.constants";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/messages.constants";

export const createNewProject = async (req: Request, res: Response) => {
  try {
    const { name, description, programming_language, collaborators } = req.body;
    const userId = req.user!.id;
    const project = await createProject(
      name,
      description,
      programming_language,
      userId,
      collaborators
    );
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: SUCCESS_MESSAGES.PROJECT_CREATED, project });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const projects = await getProjects(userId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.PROJECTS_RETRIEVED, projects });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const { code_value } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const savedCode = await saveCode(projectId, userId, code_value, userId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.CODE_SAVED, savedCode });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const getProjectDetails = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const project = await getProject(projectId, userId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.PROJECT_RETRIEVED, project });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const updateProjectDetails = async (req: Request, res: Response) => {
  try {
    const { name, description, programming_language, collaborators } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const updatedProject = await updateProject(
      projectId,
      userId,
      name,
      description,
      programming_language,
      collaborators
    );
    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.PROJECT_UPDATED,
      project: updatedProject,
    });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const deleteProjectDetails = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    await deleteProject(projectId, userId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.PROJECT_DELETED });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const executeProjectCode = async (req: Request, res: Response) => {
  try {
    const { code_value } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const executionResult = await executeCode(projectId, code_value, userId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.CODE_EXECUTED, executionResult });
  } catch (error: any) {
    res
      .status(error?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message || ERROR_MESSAGES.INTERNAL_ERROR });
  }
};
