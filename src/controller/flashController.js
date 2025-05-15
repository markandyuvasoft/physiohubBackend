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
      container
    } = req.body;

    if (!teacherId) {
      return res.status(401).json({ message: "Teacher ID not found in request" });
    }

    // const existingCard = await FlashCard.findOne({ title });
    // if (existingCard) {
    //   return res.status(400).json({ message: "A flash card with this name already exists." });
    // }

    let flashImageData = null;
    if (req.files?.flashImage) {
      const result = await cloudinary.uploader.upload(req.files.flashImage[0].path, {
        folder: "flashcard/flashImage",
      });
      flashImageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    let containerData = {};
    if (req.files?.frontImage) {
     const result = await cloudinary.uploader.upload(req.files.frontImage[0].path, {
  folder: "flashcard/container/front",
});

      containerData.frontImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (req.files?.backImage) {
      const result = await cloudinary.uploader.upload(req.files.backImage[0].path, {
        folder: "flashcard/container/back",
      });
      containerData.backImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Titles should come from body
    containerData.frontTitle = req.body.frontTitle || "";
    containerData.backTitle = req.body.backTitle || "";

    const newFlashCard = new FlashCard({
      title,
      description,
      hint,
      subject,
      masteryLevel,
      confidance_level,
      flash_topics,
      flashImage: flashImageData ? flashImageData.url : null, 
      container: containerData,
    });

    await newFlashCard.save();

    res.status(200).json({
      message: "Flash card created successfully",
      flashCard: newFlashCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:  error.message });
  }
};
