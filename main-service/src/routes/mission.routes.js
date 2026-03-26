import { Router } from "express";
import {
  getAllMissions,
  getMissionById,
} from "../controllers/mission.controller.js";

const router = Router();

router.get("/", getAllMissions); 
router.get("/:id", getMissionById);

export { router as missionRouter };
