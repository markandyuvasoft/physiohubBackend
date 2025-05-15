import express from "express";
import {
  createFlashCard,
  deleteFlashCard,
  detailedSingleFlash,
  foundAllFlashCard,
  updateFlashCard,
} from "../controller/flashController.js";
import { Token } from "../../middleware/checkAuth.js";
import { upload } from "../../middleware/image.js";
import { authorized } from "../../middleware/role.js";

const flashRouter = express.Router();

flashRouter.post(
  "/create-flash-card",
  Token,
  authorized("Teacher"),
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
    { name: "flashImage", maxCount: 1 },
  ]),
  createFlashCard
);

flashRouter.put(
  "/update-flash-card/:id",
  Token,
  authorized("Teacher"),
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
    { name: "flashImage", maxCount: 1 },
  ]),
  updateFlashCard
);

flashRouter.get(
  "/found-all-card",
  Token,
  authorized("Teacher", "Student"),
  foundAllFlashCard
);

flashRouter.get(
  "/found-single-card/:subject",
  Token,
  authorized("Teacher", "Student"),
  detailedSingleFlash
);

flashRouter.delete(
  "/delete-flash-card/:falshId",
  Token,
  authorized("Teacher", "Student"),
  deleteFlashCard
);

export default flashRouter;
