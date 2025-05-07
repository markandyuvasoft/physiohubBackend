import express from "express"
import { Token } from "../../middleware/checkAuth.js"
import { authorized } from "../../middleware/role.js"
import { createCategoryFlashCard, createFlashCardTopics, getFlashCardCategoryLevel, getFlashCardTopics } from "../controller/falshcardCategoryController.js"


const flashcardCategoryRouter = express.Router()

// for the card confidance level
flashcardCategoryRouter.post("/create-flash-level", Token, authorized("Teacher"), createCategoryFlashCard)
flashcardCategoryRouter.get("/all-flash-category-level", Token, authorized("Teacher", "Student"), getFlashCardCategoryLevel)



// for the flashcard topics

flashcardCategoryRouter.post("/create-flash-topics", Token, authorized("Teacher", "Admin"), createFlashCardTopics)


flashcardCategoryRouter.get("/all-flash-topics",Token, authorized("Teacher", "Student"), getFlashCardTopics)


export default flashcardCategoryRouter