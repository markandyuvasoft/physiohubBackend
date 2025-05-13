import FlashCard from "../model/flashSchema.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createFlahCard = async (req, res) => {
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
      container,
    } = req.body;

    if (!teacherId) {
      return res
        .status(401)
        .json({ message: "Teacher ID not found in request" });
    }

    const existingCard = await FlashCard.findOne({ title });
    if (existingCard) {
      return res.status(400).json({
        message: "A flash card with this name already exists.",
      });
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
      };
    }

    let containerData = [];
    if (container && Array.isArray(container)) {
      for (let item of container) {
        let frontImageData = null;
        let backImageData = null;

        if (item.frontImage) {
          const result = await cloudinary.uploader.upload(item.frontImage, {
            folder: "flashcard/container/front",
          });
          frontImageData = {
            url: result.secure_url,
          };
        }

        if (item.backImage) {
          const result = await cloudinary.uploader.upload(item.backImage, {
            folder: "flashcard/container/back",
          });
          backImageData = {
            url: result.secure_url,
          };
        }

        containerData.push({
          frontTitle: item.frontTitle,
          frontImage: frontImageData?.url || null,
          backTitle: item.backTitle,
          backImage: backImageData?.url || null,
        });
      }
    }

    const newFlashCard = new FlashCard({
      title,
      description,
      hint,
      subject,
      masteryLevel,
      confidance_level,
      flash_topics,
      flashImage: flashImageData?.url || null,
      container: containerData,
    });

    await newFlashCard.save();

    res.status(201).json({
      message: "Flash card created successfully",
      flashCard: newFlashCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create flash card", error });
  }
};
