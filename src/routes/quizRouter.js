import express from "express";
import { createQuizForm, detailedSingleQuiz, getAllQuiz } from "../controller/quizController.js";
import { Token } from "../../middleware/checkAuth.js";
import { authorized } from "../../middleware/role.js";
import { upload } from "../../middleware/image.js";

const quizRouter = express.Router();

quizRouter.post(
  "/createQuiz",
  Token,
  authorized("Teacher"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    ...Array.from({ length: 100 }, (_, index) => ({
      name: `questionImage[${index}]`,
      maxCount: 1,
    })),
  ]),
  createQuizForm
);


quizRouter.get("/found-quizs", Token, authorized("Student", "Teacher"), getAllQuiz)

quizRouter.get("/found-single-quizs/:quizTopics", Token, authorized("Student", "Teacher"), detailedSingleQuiz)


export default quizRouter;
