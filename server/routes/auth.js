import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changeEmail,
  changePassword,
  updateNotificationSettings,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/email", auth, changeEmail);
router.put("/password", auth, changePassword);
router.put("/notifications", auth, updateNotificationSettings);

export default router;
