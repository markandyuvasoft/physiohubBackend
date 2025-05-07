import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors"; 
import morgan from "morgan"; 
import userRouter from "./src/routes/userRouter.js";
import courseRouter from "./src/routes/courseRouter.js";
// import AuthRouter from "./src/routes/AuthRouter.js";
// import adminAuth from "./firebaseAdmin.js";
// import blogRouter from "./src/routes/BlogRouter.js";
// import AdminRouter from "./src/routes/AdminRouter.js";
// import FlashCardCategoryRouter from "./src/routes/FlashCardCategoryRouter.js";


dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(morgan('dev')); 



// const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split("Bearer ")[1];
//   try {
//     const decoded = await adminAuth.auth().verifyIdToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


app.use("/api/v1/user", userRouter)
app.use("/api/v1", courseRouter)
// app.use("/api/v1", AdminRouter)
// app.use("/api/v1", FlashCardCategoryRouter) 






// app.get("/profile", verifyToken, (req, res) => {
//   res.json({ message: `Hello ${req.user.email}` });
// });






const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

