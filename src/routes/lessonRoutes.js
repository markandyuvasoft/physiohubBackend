import express from "express"
import { Token } from "../../middleware/checkAuth.js"
import { authorized } from "../../middleware/role.js"
import { deleteLesson, detailedSingleLesson, foundLesson, lessonCreate, updateLessonDetails } from "../controller/lessonController.js"
import { upload } from "../../middleware/image.js"

const lessonRouter = express.Router()

lessonRouter.post("/create-lesson",Token, authorized("Teacher"),  upload.fields([
    { name: "content[contentImage]", maxCount: 1 },
    { name: "content[contentVideo]", maxCount: 1 },
  ]), lessonCreate )

lessonRouter.get("/found-all-lesson", Token, authorized("Student", "Teacher"), foundLesson)

lessonRouter.put("/update-lesson/:lessonId",Token, authorized("Teacher"),upload.fields([
  { name: "content[contentImage]", maxCount: 1 },
    { name: "content[contentVideo]", maxCount: 1 },
  ]), updateLessonDetails)

lessonRouter.delete("/delete-lesson/:lessonId", Token, authorized("Teacher"), deleteLesson)

lessonRouter.get(
  "/found-lesson-single/:_id",
  Token,
  authorized("Teacher", "Student"),
  detailedSingleLesson
);

export default lessonRouter