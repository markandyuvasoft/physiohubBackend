import mongoose from "mongoose";

const flashSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    hint: {
      type: String,
    },

    subject: {
      type: String,
    },
    masteryLevel: {
      type: String,
    },

    confidance_level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashCardConfidance",
    },

    flash_topics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashCardTopics",
    },

    flashImage: {
      type: String,
      public_id: { type: String },
    },

    container: {
      frontTitle: {
        type: String,
      },
      frontImage: {
        type: String,
        public_id: { type: String },
      },

      backTitle: {
        type: String,
      },
      backImage: {
        type: String,
        public_id: { type: String },
      },
    },
  },
  { timestamps: true }
);

const FlashCard = mongoose.model("FlashCard", flashSchema);

export default FlashCard;
