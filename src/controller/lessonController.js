import Lesson from "../model/lessonSchema.js";
import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export const lessonCreate = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const {
        lessonName,
        lessonDescription,
        lessonTopic,
        averageDuration,
        isCompleted,
        lessonNumber,
      } = req.body

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    const checkLesson = await Lesson.findOne({ lessonName });

    if (checkLesson) {
      return res.status(400).json({
        message: "A lesson with this name already exists.",
      });
    }

        const newLesson = new Lesson({
            lessonName,
            lessonDescription,
            lessonTopic,
            averageDuration,
            isCompleted,
            lessonNumber,
          });

    const savedLesson  = await newLesson.save();

    res.status(201).json({
      message: "lesson created successfully!",
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({
      message: "Failed to create lesson.",
      error: error.message,
    });
  }
};

export const foundLesson = async (req, res) => {
    try {
      const checkLesson = await Lesson.find({})
      
        .sort({ createdAt: -1 });
  
      if (checkLesson.length > 0) {
        res.status(200).json({
          message: "all lesson are",
          allLesson: checkLesson,
        });
      } else {
        res.status(404).json({
          message: "not found any lesson",
        });
      }
    } catch (error) {
      console.error("Error found lesson:", error);
      res.status(500).json({
        message: "Failed to found lesson.",
        error: error.message,
      });
    }
  };

  export const updateLessonDetails = async (req, res) => {
    try {
  
      const {lessonId} = req.params
  
    const {
        lessonName,
        lessonDescription,
        lessonTopic,
        averageDuration,
        isCompleted,
        lessonNumber,
      } = req.body
  
      const updateFields = {
        lessonName,
        lessonDescription,
        lessonTopic,
        averageDuration,
        isCompleted,
        lessonNumber,
      };
  
      const updatedLesson = await Lesson.findByIdAndUpdate(
          {_id : lessonId},
        { $set: updateFields },
        {
          new: true,
        }
      );
  
      if (!updatedLesson) {
        return res.status(444).json({ message: "lesson not found" });
      }
  
      res.status(200).json({
        message: "Lesson updated successfully",
        updatedLesson
      });
  
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Failed to update lesson", error: error.message });
    }
  };

  export const deleteLesson = async (req, res) => {
    try {
      const { lessonId } = req.params;
  
      const checkLesson = await Lesson.findOne({ _id: lessonId });
  
      if (!checkLesson) {
        return res.status(404).json({
          message: "not found this lesson",
        });
      }
  
      const deletedLesson = await Lesson.findOneAndDelete({ _id: lessonId });
  
      res.status(200).json({
        message: "deleted this type of lesson",
      });
    } catch (error) {
      console.error("Error found lesson:", error);
      res.status(500).json({
        message: "Failed to found lesson.",
        error: error.message,
      });
    }
  };