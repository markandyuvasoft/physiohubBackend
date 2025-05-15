import FlashCard from "../model/flashSchema.js";
import Review from "../model/ratingSchema.js";

// Route iska user me hi add hai.............................

export const submitReview = async (req, res) => {
  try {
    const { flashCardId, rating, reviewText } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      flashCard: flashCardId,
      user: userId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this flashcard." });
    }

    const review = new Review({
      flashCard: flashCardId,
      user: userId,
      rating,
      reviewText,
    });
    await review.save();

    const reviews = await Review.find({ flashCard: flashCardId });
    const numReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    const userReview = await FlashCard.findByIdAndUpdate(flashCardId, {
      averageRating,
      numReviews,
      reviewText,
    }).select(
      "-container -title -description -hint -subject -masteryLevel -confidance_level -flash_topics -flashImage"
    );

    res
      .status(200)
      .json({ message: "Review submitted successfully.", userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashCardReviews = async (req, res) => {
  try {
    const { flashCardId } = req.params;

    const reviews = await Review.find({ flashCard: flashCardId }).populate(
      "flashCard",
      "title"
    );
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.status(200).json({
      message: "review and rating",
      flashCardId: flashCardId,
      title: reviews[0].flashCard.title,
      averageRating: averageRating,
      numReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
