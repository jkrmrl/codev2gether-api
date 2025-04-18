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
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../utils/constants";

export const createNewProject = async (req: Request, res: Response) => {
  try {
    const { name, description, programming_language, collaborators } = req.body;
    const owner_id = req.user!.id;
    const project = await createProject(
      name,
      description,
      programming_language,
      owner_id,
      collaborators
    );
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: SUCCESS_MESSAGES.PROJECT_CREATED, project });
  } catch (error: any) {
    res.status(error?.status).json({ message: error?.message });
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
    res.status(error?.status).json({ message: error?.message });
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
    res.status(error?.status).json({ message: error?.message });
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
    res.status(error?.status).json({ message: error?.message });
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
    res.status(error?.status).json({ message: error?.message });
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
    res.status(error?.status).json({ message: error?.message });
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
      .json({ message: error?.message || "An unexpected error occurred." });
  }
};
