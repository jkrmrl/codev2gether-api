import { Request, Response } from "express";
import * as services from "../services";
import * as constants from "../constants";

export const createNewProject = async (req: Request, res: Response) => {
  try {
    const { name, description, programming_language, collaborators } = req.body;
    const userId = req.user!.id;
    const project = await services.createProject(
      name,
      description,
      programming_language,
      userId,
      collaborators
    );
    res
      .status(constants.HTTP_STATUS.CREATED)
      .json({ message: constants.SUCCESS_MESSAGES.PROJECT_CREATED, project });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const projects = await services.getProjects(userId);
    res.status(constants.HTTP_STATUS.OK).json({
      message: constants.SUCCESS_MESSAGES.PROJECTS_RETRIEVED,
      projects,
    });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const { code_value } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const savedCode = await services.saveCode(
      projectId,
      userId,
      code_value,
      userId
    );
    res
      .status(constants.HTTP_STATUS.OK)
      .json({ message: constants.SUCCESS_MESSAGES.CODE_SAVED, savedCode });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const getProjectDetails = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const project = await services.getProject(projectId, userId);
    res
      .status(constants.HTTP_STATUS.OK)
      .json({ message: constants.SUCCESS_MESSAGES.PROJECT_RETRIEVED, project });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const updateProjectDetails = async (req: Request, res: Response) => {
  try {
    const { name, description, programming_language, collaborators } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const updatedProject = await services.updateProject(
      projectId,
      userId,
      name,
      description,
      programming_language,
      collaborators
    );
    res.status(constants.HTTP_STATUS.OK).json({
      message: constants.SUCCESS_MESSAGES.PROJECT_UPDATED,
      project: updatedProject,
    });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const deleteProjectDetails = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    await services.deleteProject(projectId, userId);
    res
      .status(constants.HTTP_STATUS.OK)
      .json({ message: constants.SUCCESS_MESSAGES.PROJECT_DELETED });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};

export const executeProjectCode = async (req: Request, res: Response) => {
  try {
    const { code_value } = req.body;
    const projectId = parseInt(req.params.projectId);
    const userId = req.user!.id;
    const executionResult = await services.executeCode(
      projectId,
      code_value,
      userId
    );
    res.status(constants.HTTP_STATUS.OK).json({
      message: constants.SUCCESS_MESSAGES.CODE_EXECUTED,
      executionResult,
    });
  } catch (error: any) {
    res
      .status(error?.status || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        message: error?.message || constants.ERROR_MESSAGES.INTERNAL_ERROR,
      });
  }
};
