import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import BlogPublic from "../model/BlogPublicSchema.js";
import BlogDraft from "../model/BlogSchema.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createBlog = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, shortDescription, contentDetails, category, saveAsBlog } =
      req.body;

    if (!title || !shortDescription || !contentDetails || !category) {
      return res.status(400).json({ message: "Enter all required fields" });
    }

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "teacherId not found in request" });
    }

    let coverBlogImage = null;

    if (req.files && req.files.coverBlogImage) {
      const result = await cloudinary.uploader.upload(
        req.files.coverBlogImage[0].path,
        {
          folder: "blog_images",
        }
      );
      coverBlogImage = {
        url: result.secure_url,
      };
    }

    let thumbnailBlogImage = null;

    if (req.files && req.files.thumbnailBlogImage) {
      const result = await cloudinary.uploader.upload(
        req.files.thumbnailBlogImage[0].path,
        {
          folder: "blog_images",
        }
      );
      thumbnailBlogImage = {
        url: result.secure_url,
      };
    }

    const BlogModel = saveAsBlog === "public" ? BlogPublic : BlogDraft;

    const newBlog = new BlogModel({
      title,
      shortDescription,
      contentDetails,
      category,
      blogCreatedBy: teacherId,
      coverBlogImage: coverBlogImage?.url,
      thumbnailBlogImage: thumbnailBlogImage?.url,
      saveAsBlog,
    });

    await newBlog.save();

    res.status(200).json({
      message: `Blog saved as ${saveAsBlog}`,
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const checkBlogs = await BlogDraft.find({}).populate({
      path: "blogCreatedBy",
      select: "fullName profileImage",
    });

    const publiCBlog = await BlogPublic.find({}).populate({
      path: "blogCreatedBy",
      select: "fullName profileImage",
    });

    if (checkBlogs.length > 0 || publiCBlog.length > 0) {
      res.status(200).json({
        message: "all featured blogs",
        allBlogs: checkBlogs,
        publicBlog : publiCBlog
      });
    } else {
      res.status(404).json({
        message: "not found any blogs",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

     const draftBlog = await BlogDraft.findOneAndDelete({ _id: blogId });

    // Attempt to delete the blog from BlogPublic collection
    const publicBlog = await BlogPublic.findOneAndDelete({ _id: blogId });

   if (draftBlog || publicBlog) {
      return res.status(200).json({
        message: "Blog deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "not found any blog",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const teacherId = req.userId;

    const { title, shortDescription, contentDetails, category, saveAsBlog } =
      req.body;

    const BlogModel = saveAsBlog === "public" ? BlogPublic : BlogDraft;

    const updateFields = {
      title,
      shortDescription,
      contentDetails,
      category,
      saveAsBlog,
    };

    if (req.files && req.files.coverBlogImage) {
      const coverBlogImageUpload = await cloudinary.uploader.upload(
        req.files.coverBlogImage[0].path,
        {
          folder: "blog_images",
        }
      );
      updateFields.coverBlogImage = coverBlogImageUpload.secure_url;
    }

    if (req.files && req.files.thumbnailBlogImage) {
      const thumbnailBlogImageUpload = await cloudinary.uploader.upload(
        req.files.thumbnailBlogImage[0].path,
        {
          folder: "blog_images",
        }
      );
      updateFields.thumbnailBlogImage = thumbnailBlogImageUpload.secure_url;
    }


      const updatedBlog = await BlogModel.findOneAndUpdate(
      { _id: blogId, teacherId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: `Blog updated successfully in ${saveAsBlog}`,
      blog: updatedBlog,
    });

  } catch (error) {
     console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  
  }
};
