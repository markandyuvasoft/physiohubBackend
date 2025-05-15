import express from "express";
import { deleteAuthDetails, forgetPassword, getAuthDetails, loginAuth, registerAuth, reset_password, updateAuthDetails, updateUserOnboarding, verifyEmail, verifyOtp } from "../controller/userController.js";
import { Token } from "../../middleware/checkAuth.js";
import { authorized } from "../../middleware/role.js";
import { upload } from "../../middleware/image.js";
import { getStudentMonthlyAttendance, markAttendance } from "../controller/attendanceController.js";
import { getFlashCardReviews, submitReview } from "../controller/ratingController.js";



const userRouter = express.Router();



userRouter.post("/register", registerAuth);

userRouter.post("/login", loginAuth)

userRouter.post("/verify-email", verifyEmail)

userRouter.post("/verify-otp", verifyOtp)

userRouter.post("/forget-password", forgetPassword)

userRouter.post("/reset-password", reset_password)

userRouter.get("/found-auth-details",Token,authorized("Student", "Teacher"), getAuthDetails)

userRouter.delete("/delete-auth-profile", Token, authorized("Student"), deleteAuthDetails)

userRouter.put("/update-user-details", Token, authorized("Student"), upload.fields([{ name: "profileImage", maxCount: 1 },]), updateAuthDetails);

userRouter.put("/update-user-onBoarding/:userId", updateUserOnboarding);


// FOR ATTENDANCE

userRouter.post("/attendance",Token, authorized("Student", "Admin", "Teacher"), markAttendance )

userRouter.get("/get-attandance/:studentId", Token, authorized("Student", "Admin", "Teacher"), getStudentMonthlyAttendance);



// FOR REVIEW AND RATING

userRouter.post("/add-review", Token, authorized("Student", "Teacher"), submitReview)

userRouter.get("/get-flash-review/:flashCardId", Token, authorized("Student", "Admin", "Teacher"), getFlashCardReviews);


export default userRouter;
