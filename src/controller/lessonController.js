import Lesson from "../model/lessonSchema.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const lessonCreate = async (req, res) => {

  try {
    const teacherId = req.user.id;
    const { lessonName, lessonDescription, lessonTopic, averageDuration, isCompleted, lessonNumber, courseId } = req.body;
    const content = [{
      contentText: req.body['content[0]contentText']
    }];


    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    // Handle image upload if exists
    if (req.files && req.files['content[0][contentImage]']) {
      const imageResult = await cloudinary.uploader.upload(
        req.files['content[0][contentImage]'][0].path,
        {
          folder: "lessons/images",
          resource_type: "auto",
          overwrite: true,
        }
      );
      content[0].contentImage = imageResult.secure_url;
      content[0].public_id = imageResult.public_id;
    }


    // Handle video upload if exists
    if (req.files && req.files['content[0][contentVideo]']) {
      const videoResult = await cloudinary.uploader.upload(
        req.files['content[0][contentVideo]'][0].path,
        {
          folder: "lessons/videos",
          resource_type: "video",
          overwrite: true,
        }
      );
      content[0].contentVideo = videoResult.secure_url;
      content[0].public_id = videoResult.public_id;
    }


    const lessonData = {
      lessonName,
      lessonDescription,
      lessonTopic,
      averageDuration,
      isCompleted,
      lessonNumber,
      courseId,
      content
    };

    const lesson = new Lesson(lessonData);
    const savedLesson = await lesson.save();

    res.status(200).json({
      message : "created new lesson successfully",

    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// export const updateLessonDetails = async (req, res) => {
//   try {
//     const { lessonId } = req.params;

//     const {
//       lessonName,
//       lessonDescription,
//       lessonTopic,
//       averageDuration,
//       isCompleted,
//       lessonNumber,
//     } = req.body;

//     const updateFields = {
//       lessonName,
//       lessonDescription,
//       lessonTopic,
//       averageDuration,
//       isCompleted,
//       lessonNumber,
//     };

//     const updatedLesson = await Lesson.findByIdAndUpdate(
//       { _id: lessonId },
//       { $set: updateFields },
//       {
//         new: true,
//       }
//     );

//     if (!updatedLesson) {
//       return res.status(444).json({ message: "lesson not found" });
//     }

//     res.status(200).json({
//       message: "Lesson updated successfully",
//       updatedLesson,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res
//       .status(500)
//       .json({ message: "Failed to update lesson", error: error.message });
//   }
// };





export const updateLessonDetails = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {lessonId} = req.params;

    const { lessonName, lessonDescription, lessonTopic, averageDuration, isCompleted, lessonNumber, courseId } = req.body;
    
    if (!teacherId) {
      return res.status(401).json({ message: "Teacher ID not found in request" });
    }

    const existingLesson = await Lesson.findById(lessonId);
    if (!existingLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const content = [{
      contentText: req.body['content[0]contentText']
    }];

    // Handle image upload if exists
    if (req.files && req.files['content[0][contentImage]']) {
      // Delete old image if exists
      if (existingLesson.content[0]?.public_id) {
        await cloudinary.uploader.destroy(existingLesson.content[0].public_id);
      }
      const imageResult = await cloudinary.uploader.upload(
        req.files['content[0][contentImage]'][0].path,
        {
          folder: "lessons/images",
          resource_type: "auto",
          overwrite: true,
        }
      );
      content[0].contentImage = imageResult.secure_url;
      content[0].public_id = imageResult.public_id;
    } else {
      content[0].contentImage = existingLesson.content[0]?.contentImage;
      content[0].public_id = existingLesson.content[0]?.public_id;
    }

    if (req.files && req.files['content[0][contentVideo]']) {
      if (existingLesson.content[0]?.public_id) {
        await cloudinary.uploader.destroy(existingLesson.content[0].public_id);
      }
      const videoResult = await cloudinary.uploader.upload(
        req.files['content[0][contentVideo]'][0].path,
        {
          folder: "lessons/videos",
          resource_type: "video",
          overwrite: true,
        }
      );
      content[0].contentVideo = videoResult.secure_url;
      content[0].public_id = videoResult.public_id;
    } else {
      content[0].contentVideo = existingLesson.content[0]?.contentVideo;
      content[0].public_id = existingLesson.content[0]?.public_id;
    }

    
    const lessonData = {
      lessonName,
      lessonDescription,
      lessonTopic,
      averageDuration,
      isCompleted,
      lessonNumber,
      courseId,
      content
    };
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      lessonData,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Lesson updated successfully",
      lesson: updatedLesson
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
