import express from "express"
import { Token } from "../../middleware/checkAuth.js"
import { authorized } from "../../middleware/role.js"
import { deleteLesson, foundLesson, lessonCreate, updateLessonDetails } from "../controller/lessonController.js"

const lessonRouter = express.Router()

lessonRouter.post("/create-lesson",Token, authorized("Teacher"), lessonCreate )

lessonRouter.get("/found-all-lesson", Token, authorized("Student", "Teacher"), foundLesson)

lessonRouter.put("/update-lesson/:lessonId",Token, authorized("Teacher"), updateLessonDetails)

lessonRouter.delete("/delete-lesson/:lessonId", Token, authorized("Teacher"), deleteLesson)

export default lessonRouter