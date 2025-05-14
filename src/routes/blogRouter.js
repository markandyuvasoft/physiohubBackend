import express from "express";
import { upload } from "../../middleware/image.js";
import { Token } from "../../middleware/checkAuth.js";
import { authorized } from "../../middleware/role.js";
import {
  createBlog,
  deleteBlog,
  detailedBlogCategory,
  getAllBlogs,
  updateBlog,
} from "../controller/BlogController.js";

const blogRouter = express.Router();

blogRouter.post(
  "/create-blog",
  upload.fields([
    { name: "coverBlogImage", maxCount: 1 },
    { name: "thumbnailBlogImage", maxCount: 1 },
  ]),
  Token,
  authorized("Teacher"),
  createBlog
);

blogRouter.get(
  "/found-all-blogs",
  Token,
  authorized("Teacher", "Student"),
  getAllBlogs
);


blogRouter.get(
  "/found-blog-category/:category",
  Token,
  authorized("Teacher", "Student"),
  detailedBlogCategory
);

blogRouter.delete(
  "/delete-blog/:blogId",
  Token,
  authorized("Teacher", "Admin"),
  deleteBlog
);

blogRouter.put(
  "/update-blog/:blogId",
  upload.fields([
    { name: "coverBlogImage", maxCount: 1 },
    { name: "thumbnailBlogImage", maxCount: 1 },
  ]),
  Token,
  authorized("Teacher"),
  updateBlog
);

export default blogRouter;
