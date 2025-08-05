import { Router } from "express";
import * as controllers from "../controllers";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, controllers.createNewProject);
router.get("/", authenticate, controllers.getAllProjects);
router.post("/:projectId", authenticate, controllers.saveProjectCode);
router.get("/:projectId", authenticate, controllers.getProjectDetails);
router.put("/:projectId", authenticate, controllers.updateProjectDetails);
router.delete("/:projectId", authenticate, controllers.deleteProjectDetails);
router.post(
  "/:projectId/execute",
  authenticate,
  controllers.executeProjectCode
);

export default router;
