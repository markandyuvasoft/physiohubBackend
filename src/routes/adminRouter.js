import express from "express"
import { getAllRegisterUser_Teachers, makeATeacher } from "../controller/adminController.js"
import { Token } from "../../middleware/checkAuth.js"
import { authorized } from "../../middleware/role.js"


const AdminRouter = express.Router()


AdminRouter.get("/all-student-teachers",Token, authorized("Admin"), getAllRegisterUser_Teachers)


AdminRouter.put("/make-teachers/:studentId",Token, authorized("Admin"), makeATeacher)



export default AdminRouter
