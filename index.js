import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors"; 
import morgan from "morgan"; 
import userRouter from "./src/routes/userRouter.js";
import courseRouter from "./src/routes/courseRouter.js";
import flashcardCategoryRouter from "./src/routes/flashCardCategory.js";
import lessonRouter from "./src/routes/lessonRoutes.js";
import AdminRouter from "./src/routes/adminRouter.js";
import blogRouter from "./src/routes/blogRouter.js";
import flashRouter from "./src/routes/flashRouter.js";
import quizRouter from "./src/routes/quizRouter.js";



dotenv.config();

const app = express();

connectDb();

app.use(express.json());


app.use(cors());
app.use(morgan('dev')); 



app.use("/api/v1/user", userRouter)
app.use("/api/v1", courseRouter)
app.use("/api/v1", flashcardCategoryRouter)
app.use("/api/v1", lessonRouter)
app.use("/api/v1", AdminRouter)
app.use("/api/v1", blogRouter)
app.use("/api/v1", flashRouter)
app.use("/api/v1", quizRouter)








// app.use("/api/v1", FlashCardCategoryRouter) 



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

