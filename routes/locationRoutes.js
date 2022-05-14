import express from "express";
import {
  deleteLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  createLocation,
} from "../controllers/locationController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllLocations);
router.route("/").post(authenticateUser, createLocation);
router.route("/:id").get(getLocationById);
router.route("/:id").patch(authenticateUser, updateLocation);
router.route("/:id").delete(authenticateUser, deleteLocation);

export default router;
