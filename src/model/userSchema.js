import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    mobileNumber: {
      type: Number,
    },

    profileImage: {
      url: { type: String },
      public_id: { type: String },
    },

    birthDay: {
      type: String,
    },

    otp: {
      type: Number,
    },

    isEmail_verification: {
      type: Boolean,
      default: false,
    },

    isNumber_verification: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "Student",
      enum: ["Student", "Teacher", "Admin"],
    },

    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    onBoarding: {
      type: Boolean,
      default: false,
    },

    isForget: {
      type: Boolean,
      default: false,
    },

    purpose : {
      type : String,
      enum : ["emailVerification", "passwordReset"]
    },

    interest: {
      goal: {
        type: String,
      },
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
      },

      preferences: {
        type: String,
        enum: ["Daily", "Weekly", "only for important updates"],
      },

      area_of_interest: [
        {
          type: Array,
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
