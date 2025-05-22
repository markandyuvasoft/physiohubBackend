import Quiz from "../model/quizSchema.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createQuizForm = async (req, res) => {
  try {
    const teacherId = req.user.id;

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    const { quizLable, quizTopics, question, explanation } = req.body;

    let coverImage = null;

    if (req.files && req.files.coverImage) {
      const result = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "coverImage_images",
          public_id: `coverImage_${quizLable.replace(
            /\s+/g,
            "_"
          )}_${Date.now()}`,
        }
      );
      coverImage = {
        url: result.secure_url,
      };
    }

    // Handle question images using map
    const questionsWithImages = await Promise.all(
      question.map(async (q, index) => {
        let questionImage = null;
        if (req.files && req.files[`questionImage[${index}]`]) {
          const qImage = await cloudinary.uploader.upload(
            req.files[`questionImage[${index}]`][0].path,
            {
              folder: "question_images",
              public_id: `questionImage_${index}_${Date.now()}`,
            }
          );
          questionImage = {
            url: qImage.secure_url,
            public_id: qImage.public_id,
          };
        }
        return {
          ...q,
          questionImage: questionImage?.url || null,
          public_id: questionImage?.public_id || null,
        };
      })
    );

    const newQuiz = new Quiz({
      quizLable,
      quizTopics,
      question: questionsWithImages,
      explanation,
      coverImage: coverImage?.url,
    });

    await newQuiz.save();

    res.status(200).json({
      message: "Quiz created successfully!",
      newQuiz: newQuiz,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};




export const getAllQuiz = async (req, res) => {
  try {
    const checkQuiz = await Quiz.find({});

    const quizzesWithCount = checkQuiz.map(quiz => ({
      ...quiz.toObject(),
      totalQuestions: quiz.question.length
    }));

    res.status(200).json({
      status: "success",
       message: "all Quiz",
      allQuiz: quizzesWithCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
       message: "internal server error",
      error: error.message,
    });
  }
};


export const detailedSingleQuiz = async (req, res) => {
  try {
    const { quizTopics } = req.params;

    const checkSingleQuiz = await Quiz.find({ quizTopics });

    const totalQuiz = checkSingleQuiz.reduce((accumulator, quiz) => {
      return accumulator + (quiz.question?.length || 0);
    }, 0);

    res.status(200).json({
      message: "Single flash detailed",
      feature_single_quiz: checkSingleQuiz,
      totalQuiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

