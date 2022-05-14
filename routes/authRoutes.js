import express from "express";
import {
  register,
  login,
  updateUser,
  getUserByID,
  getAllUsers,
  updateUserAdmin,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import fileUpload from "../middleware/file-upload.js";

const router = express.Router();

router.route("/register").post(fileUpload.single("image"), register);
router.route("/login").post(login);
router.route("/getUser").post(authenticateUser, getUserByID);
router
  .route("/updateUser")
  .put(authenticateUser, fileUpload.single("image"), updateUser);
router
  .route("/updateUserAdmin")
  .put(authenticateUser, authorization("Admin"), updateUserAdmin);
router
  .route("/allUsers")
  .get(authenticateUser, authorization("Admin"), getAllUsers);
router
  .route("/getUser/:id")
  .get(authenticateUser, authorization("Admin"), getUserByID);

export default router;
