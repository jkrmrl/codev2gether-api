import { Router } from "express";
import * as controllers from "../controllers/auth.controllers";

const router = Router();

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.post("/refresh-token", controllers.refreshTokenController);
router.post("/logout", controllers.logout);

export default router;
