import mongoose from "mongoose";


const flashcardTopics = new mongoose.Schema({

    topicFlashName : {
        type : String
    }

},{new : true})


const FlashCardTopics = mongoose.model("FlashCardTopics", flashcardTopics)

export default FlashCardTopics