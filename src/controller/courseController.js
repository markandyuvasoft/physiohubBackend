import Course from "../model/courseSchema.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// for create course.......
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const {
      courseName,
      courseDescription,
      coursePrice,
      categories,
      total_number_of_lesson,
      total_number_of_quize,
      courseDuration
    } = req.body;

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    const checkCourse = await Course.findOne({ courseName });

    if (checkCourse) {
      return res.status(400).json({
        message: "A course with this name already exists.",
      });
    }

    let courseImage = null;

    if (req.files && req.files.courseImage) {
      const result = await cloudinary.uploader.upload(
        req.files.courseImage[0].path,
        {
          folder: "course_images",
          public_id: `course_${courseName.replace(/\s+/g, "_")}_${Date.now()}`,
        }
      );
      courseImage = {
        url: result.secure_url,
      };
    }

    const isFree =
      coursePrice === undefined || coursePrice === null || coursePrice === ""
        ? true
        : false;

    const newCourse = new Course({
      courseName,
      courseDescription,
      coursePrice,
      categories,
      total_number_of_lesson,
      total_number_of_quize,
      courseImage: courseImage?.url,
      courseDuration,
      courseCreatedBy: teacherId,
      isFree,
    });

    const savedCourse = await newCourse.save();

    res.status(200).json({
      message: "Course created successfully!",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Failed to create course.",
      error: error.message,
    });
  }
};

// for found all course..........
export const foundCourse = async (req, res) => {
  try {
    const checkCourse = await Course.find({})
      .populate({
        path: "courseCreatedBy",
        select: "fullName",
      })
      .sort({ createdAt: -1 });

      res.status(200).json({
        message: "all course are",
        allCourses: checkCourse,
      });
   
  } catch (error) {
    console.error("Error found course:", error);
    res.status(500).json({
      message: "Failed to found course.",
      error: error.message,
    });
  }
};

// for delete the course..............
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const checkCourse = await Course.findOne({ _id: courseId });

    if (!checkCourse) {
      return res.status(404).json({
        message: "not found this course",
      });
    }

    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });

    res.status(200).json({
      message: "deleted this type of course",
    });
  } catch (error) {
    console.error("Error found course:", error);
    res.status(500).json({
      message: "Failed to found course.",
      error: error.message,
    });
  }
};

// for update the course...........
export const updateCourseDetails = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const {courseId} = req.params

    const {
      courseName,
      courseDescription,
      coursePrice,
      categories,
      total_number_of_lesson,
      total_number_of_quize,
      courseDuration
    } = req.body;

    const updateFields = {
      courseName,
      courseDescription,
      coursePrice,
      categories,
      total_number_of_lesson,
      total_number_of_quize,
      courseDuration,
      courseId
    };

    if (req.files && req.files.courseImage) {
      const courseImageUpload = await cloudinary.uploader.upload(
        req.files.courseImage[0].path,
        {
          folder: "course_images",
          public_id: `profile_${teacherId}`,
          overwrite: true,
        }
      );
      updateFields.courseImage = courseImageUpload.secure_url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        {_id : courseId},
      { $set: updateFields },
      {
        new: true,
      }
    );

    if (!updatedCourse) {
      return res.status(444).json({ message: "course not found" });
    }

    res.status(200).json({
      message: "Course updated successfully",
      updatedCourse
    });

  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Failed to update course", error: error.message });
  }
};
