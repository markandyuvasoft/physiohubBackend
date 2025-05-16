import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
    },

    courseDescription: {
      type: String,
    },

    courseImage: {
      type: String ,
      public_id: { type: String },
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    coursePrice: {
      type: Number,
    },

    categories: {
      type: String,
    },

    // total_number_of_lesson: {
    //   type: Number,
    // },

    // total_number_of_quize: {
    //   type: Number,
    // },

     lesson: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    quizs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },

    courseDuration : {
      type : String
    },

    courseCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
