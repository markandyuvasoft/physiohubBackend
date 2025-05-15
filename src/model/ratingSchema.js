import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    flashCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FlashCard',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
