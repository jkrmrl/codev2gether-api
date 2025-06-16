import { Router } from "express";
import {
  register,
  login,
  refreshTokenController,
  logout,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logout);

export default router;
