import mongoose from "mongoose";

const blogPublicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    shortDescription: {
      type: String,
    },

    contentDetails: {
      type: String,
    },

    category: {
      type: String, //alg se details aayegi
    },

    coverBlogImage: {
     type: String ,
      public_id: { type: String },
    },

    thumbnailBlogImage: {
      type: String ,
      public_id: { type: String },
    },

    saveAsBlog: {
      type: String,
      default: "draft",
    },

    blogCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const BlogPublic = mongoose.model("BlogPublic", blogPublicSchema);

export default BlogPublic;
