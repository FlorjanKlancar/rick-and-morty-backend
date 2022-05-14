import express from "express";
import {
  getAllCharacters,
  getCharacterById,
  addNewCharacter,
  updateCharacter,
  deleteCharacter,
} from "../controllers/characterController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllCharacters);
router.route("/").post(addNewCharacter);
router.route("/:id").get(getCharacterById);
router.route("/:id").patch(authenticateUser, updateCharacter);
router.route("/:id").delete(authenticateUser, deleteCharacter);

export default router;
