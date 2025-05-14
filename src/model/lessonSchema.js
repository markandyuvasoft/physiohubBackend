import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonName: {
      type: String,
    },

    lessonDescription: {
      type: String,
    },

    lessonTopic: {
      type: String,
    },

    averageDuration: {
      type: String,
    },
    
    isCompleted: {
      type: Boolean,
      default: false,
    },

    content: {
        contentText: {
          type: String,
        },

        contentImage: {
          type: String,
          public_id: { type: String },
        },
        contentVideo: {
          type: String,
          public_id: { type: String },
        },
    },
    
    lessonNumber: {
      type: Number,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
