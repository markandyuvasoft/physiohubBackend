import FlashCard from "../model/flashSchema.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createFlashCard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const {
      title,
      description,
      hint,
      subject,
      masteryLevel,
      confidance_level,
      flash_topics,
      frontTitle,
      backTitle,
    } = req.body;

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    let flashImageData = null;
    if (req.files?.flashImage) {
      const result = await cloudinary.uploader.upload(
        req.files.flashImage[0].path,
        {
          folder: "flashcard/flashImage",
        }
      );
      flashImageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    // Handle container images and titles
    let containerData = {
      frontTitle: frontTitle || "",
      backTitle: backTitle || "",
    };

    if (req.files?.frontImage) {
      const result = await cloudinary.uploader.upload(
        req.files.frontImage[0].path,
        {
          folder: "flashcard/container/front",
        }
      );
      containerData.frontImage = result.secure_url;
      containerData.frontImage_public_id = result.public_id;
    }

    if (req.files?.backImage) {
      const result = await cloudinary.uploader.upload(
        req.files.backImage[0].path,
        {
          folder: "flashcard/container/back",
        }
      );
      containerData.backImage = result.secure_url;
      containerData.backImage_public_id = result.public_id;
    }

    const newFlashCard = new FlashCard({
      title,
      description,
      hint,
      subject,
      masteryLevel,
      confidance_level,
      flash_topics,
      flashImage: flashImageData ? flashImageData.url : null,
      flashImage_public_id: flashImageData ? flashImageData.public_id : null,
      container: containerData,
    });
    await newFlashCard.save();

    res.status(201).json({
      success: true,
      message: "Flash card created successfully",
      flashCard: newFlashCard,
    });
  } catch (error) {
    console.error("Error creating flashcard:", error);
    res.status(500).json({
      success: false,
      message: "Error creating flashcard",
      error: error.message,
    });
  }
};

export const updateFlashCard = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      hint,
      subject,
      masteryLevel,
      confidance_level,
      flash_topics,
      frontTitle,
      backTitle,
    } = req.body;

    const existingFlashCard = await FlashCard.findById(id);

    if (!existingFlashCard) {
      return res.status(404).json({
        success: false,
        message: "Flashcard not found",
      });
    }
    let flashImageData = null;
    if (req.files?.flashImage) {
      if (existingFlashCard.flashImage_public_id) {
        await cloudinary.uploader.destroy(
          existingFlashCard.flashImage_public_id
        );
      }
      const result = await cloudinary.uploader.upload(
        req.files.flashImage[0].path,
        {
          folder: "flashcard/flashImage",
        }
      );
      flashImageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    let containerData = {
      frontTitle: frontTitle || existingFlashCard.container.frontTitle,
      backTitle: backTitle || existingFlashCard.container.backTitle,
      frontImage: existingFlashCard.container.frontImage,
      backImage: existingFlashCard.container.backImage,
    };

    if (req.files?.frontImage) {
      if (existingFlashCard.container.frontImage_public_id) {
        await cloudinary.uploader.destroy(
          existingFlashCard.container.frontImage_public_id
        );
      }
      const result = await cloudinary.uploader.upload(
        req.files.frontImage[0].path,
        {
          folder: "flashcard/container/front",
        }
      );
      containerData.frontImage = result.secure_url;
      containerData.frontImage_public_id = result.public_id;
    }

    if (req.files?.backImage) {
      if (existingFlashCard.container.backImage_public_id) {
        await cloudinary.uploader.destroy(
          existingFlashCard.container.backImage_public_id
        );
      }
      const result = await cloudinary.uploader.upload(
        req.files.backImage[0].path,
        {
          folder: "flashcard/container/back",
        }
      );
      containerData.backImage = result.secure_url;
      containerData.backImage_public_id = result.public_id;
    }
    const updatedFlashCard = await FlashCard.findByIdAndUpdate(
      id,
      {
        // title            : title || existingFlashCard.title,
        // description      : description || existingFlashCard.description,
        // hint              : hint || existingFlashCard.hint,
        // subject            : subject || existingFlashCard.subject,
        // masteryLevel       : masteryLevel || existingFlashCard.masteryLevel,
        // confidance_level   :
        //                     confidance_level || existingFlashCard.confidance_level,
        // flash_topics         : flash_topics || existingFlashCard.flash_topics,

        title,
        description,
        hint,
        subject,
        masteryLevel,
        confidance_level,
        flash_topics,
        flashImage: flashImageData
          ? flashImageData.url
          : existingFlashCard.flashImage,
        container: containerData,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Flash card updated successfully",
      flashCard: updatedFlashCard,
    });

  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).json({
      success: false,
      message: "Error updating flashcard",
      error: error.message,
    });
  }
};

export const foundAllFlashCard = async (req, res) => {
  try {
    const checkFlahCard = await FlashCard.find({})
      .populate({
        path: "confidance_level",
        select: "confidance_level",
      })
      .populate({
        path: "flash_topics",
        select: "topicFlashName",
      });

    res.status(200).json({
      status: "success",
      message: "all Flah card",
      allFleshCard: checkFlahCard,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const detailedSingleFlash = async (req, res) => {
  try {
    const { subject } = req.params;

    const checkSingleFlash = await FlashCard.find({ subject })
      .populate({
        path: "confidance_level",
        select: "confidance_level",
      })
      .populate({
        path: "flash_topics",
        select: "topicFlashName",
      });

    res.status(200).json({
      message: "single falsh detailed",
      feature_single_blog: checkSingleFlash,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const deleteFlashCard = async (req, res) => {
  try {
    const { falshId } = req.params;

    const flashCard = await FlashCard.findOneAndDelete({ _id: falshId });

    if (flashCard) {
      return res.status(200).json({
        message: "card deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "not found any card",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
