import express from "express"
import { createCourse, deleteCourse, foundCourse, updateCourseDetails } from "../controller/courseController.js"
import { Token } from "../../middleware/checkAuth.js"
import { authorized } from "../../middleware/role.js"
import { upload } from "../../middleware/image.js"


const courseRouter = express.Router()

courseRouter.post("/create-course",Token, authorized("Teacher"),upload.fields([{ name: "courseImage", maxCount: 1 },]), createCourse)

courseRouter.get("/found-all-course", Token, authorized("Student", "Teacher"), foundCourse)


courseRouter.delete("/delete-course/:courseId", Token, authorized("Teacher"), deleteCourse)


courseRouter.put("/update-course/:courseId",Token, authorized("Teacher"),upload.fields([{ name: "courseImage", maxCount: 1 },]), updateCourseDetails)



export default courseRouter