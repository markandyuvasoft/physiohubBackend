import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    coverImage: {
      type: String,
      public_id: { type: String },
    },

    quizLable: {
      type: String,
    },

    quizTopics: {
      type: String,
    },

    question: [
      {
        questionImage: {
          type: String,
          public_id: { type: String },
        },

        questionName: {
          type: String,
        },

        options: [
          {
            optionText: {
              type: String,
            },

            optionCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],

        explanation: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
