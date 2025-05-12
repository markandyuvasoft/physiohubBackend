import FlashCardConfidance from "../model/flashConfidanceCategory.js";
import FlashCardTopics from "../model/flashTopicsCategory.js";

// for flash category level.....
export const createCategoryFlashCard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { confidance_level } = req.body;

    if (!teacherId) {
      return res.status(401).json({ message: "Teacher ID not found in token" });
    }

    const checkCategory = await FlashCardConfidance.findOne({
      confidance_level,
    });

    if (checkCategory) {
      return res.status(404).json({
        message: "already have this flashcard category",
      });
    }

    const saveCategory = new FlashCardConfidance({
      confidance_level,
    });

    const newCategory = await saveCategory.save();

    res.status(200).json({
      message: "flashcard category created",
      flashCategory: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getFlashCardCategoryLevel = async (req, res) => {
  try {
    const checkAll = await FlashCardConfidance.find({});

    if (checkAll.length > 0) {
      res.status(200).json({
        message: "all flashcard category level",
        categoryLevel: checkAll,
      });
    } else {
      res.status(404).json({
        message: "not found any flashcard category level",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};




// for flash category topics.........
export const createFlashCardTopics = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { topicFlashName } = req.body;

    if (!teacherId) {
      return res.status(401).json({ message: "Teacher ID not found in token" });
    }

    const checkTopics = await FlashCardTopics.findOne({ topicFlashName });

    if (checkTopics) {
      return res.status(404).json({
        message: "already have this flashcard topics",
      });
    }

    const saveTopics = new FlashCardTopics({
      topicFlashName,
    });

    const newTopics = await saveTopics.save();

    res.status(200).json({
      message: "flashcard topics created",
      flashTopics: newTopics,
    });
  } catch (error) {
    res.status(500).json({
      error : error.message,
      message: "internal server error",
    });
  }
};


export const getFlashCardTopics = async (req, res) => {
  try {
    const checkAll = await FlashCardTopics.find({});

    if (checkAll.length > 0) {
      res.status(200).json({
        message: "all flashcard topics",
        flashcardTopics: checkAll,
      });
    } else {
      res.status(404).json({
        message: "not found any flashcard topics",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
