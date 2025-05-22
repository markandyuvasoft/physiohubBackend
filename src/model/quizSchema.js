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

    creatorId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Auth"
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

        timeLimit: {
          type: Number,
          default: 60, // 1 minute
        },

        points: {
          type: Number,
          default: 0,
        },

      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
