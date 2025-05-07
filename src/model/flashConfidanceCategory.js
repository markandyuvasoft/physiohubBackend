import mongoose from "mongoose";


const flashCardConfidanceSchema = new mongoose.Schema({

    confidance_level : {
        type : String,
        enum : ["Low", "Medium", "High"]
    }

},{new : true})


const FlashCardConfidance = mongoose.model("FlashCardConfidance", flashCardConfidanceSchema)

export default FlashCardConfidance