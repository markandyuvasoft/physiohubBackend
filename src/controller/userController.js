import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendForgetPassword, sendOtpEmail } from "../../utils/mail.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// for the user register...........
export const registerAuth = async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, birthDay } = req.body;

    const checkAuth = await User.findOne({ email });

    if (checkAuth) {
      return res.status(400).json({
        message: "An account with this email address already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const authUser = new User({
      fullName,
      email,
      password: hash,
      mobileNumber,
      birthDay,
    });

    await authUser.save();

    res.status(200).json({
      message: "User registration Successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error during registration.",
      error: error.message,
    });
  }
};

// for user login.................
export const loginAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        message: "enter the details",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email credentials.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password credentials.",
      });
    }

    if (user.isEmail_verification === false) {
      return res.status(400).json({
        message: "Please verify your email address.",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Login successful!",
      authId: user._id,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      message: "Internal server error during login.",
      error: error.message,
    });
  }
};

// for verify email.......
export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "enter the email",
      });
    }

    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      return res.status(404).json({
        message: "email not found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    checkEmail.otp = otp;
    checkEmail.otpExpires = otpExpires;
    await checkEmail.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("verify email error:", error);
    res.status(500).json({
      message: "Internal server error during verify email.",
      error: error.message,
    });
  }
};

// for verify otp.........
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP." });
    }

    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    if (user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    let updateFields = {
      otp: "",
      otpExpires: null,
    };

    if (purpose === "emailVerification") {
      updateFields.isEmail_verification = true;
    } else if (purpose === "passwordReset") {
      updateFields.isForget = true;
    } else {
      return res.status(400).json({ message: "Invalid verification purpose." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email, otp },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// forget password.........
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendForgetPassword(email, otp);

    res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("forget password error:", error);
    res.status(500).json({
      message: "Internal server error during forget password.",
      error: error.message,
    });
  }
};

// for reset password..........
export const reset_password = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const checkAuth = await User.findOne({ email });

    if (!checkAuth) {
      return res.status(400).json({
        message: "no details found",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const chnage = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hash,
          isForget: false,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "reset password successfully",
    });
  } catch (error) {
    console.error("reset password error:", error);
    res.status(500).json({
      message: "Internal server error during reset password.",
      error: error.message,
    });
  }
};

// for get details user
export const getAuthDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const getDetails = await User.findOne({ _id: userId }).select(
      "-password -isEmail_verification -isNumber_verification -onBoarding -isForget -otp"
    );

    res.status(200).json({
      message: "auth details are:",
      authDetails: getDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// for delete details
export const deleteAuthDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkDetails = await User.findOneAndDelete({ _id: userId });

    if (checkDetails) {
      res.status(200).json({
        message: "successfully deleted your account",
      });
    } else {
      res.status(404).json({
        message: "not found this account",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};


// for update details
export const updateAuthDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, mobileNumber, birthDay, address, interest } = req.body;

    const updateFields = {
      fullName,
      mobileNumber,
      birthDay,
      address,
    };

    if (interest) {
      if (interest.goal !== undefined) {
        updateFields["interest.goal"] = interest.goal;
      }
      if (interest.preferences !== undefined) {
        updateFields["interest.preferences"] = interest.preferences;
      }
      if (interest.area_of_interest !== undefined) {
        updateFields["interest.area_of_interest"] = interest.area_of_interest;
      }
    }

    // for profile image
    if (req.files && req.files.profileImage) {
      const profileImageUpload = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        {
          folder: "user_profiles",
          public_id: `profile_${userId}`,
          overwrite: true,
        }
      );
      updateFields.profileImage = profileImageUpload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(444).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Failed to update details", error: error.message });
  }
};


// for update onBoarding details
export const updateUserOnboarding = async (req, res) => {

  try {
    const { userId } = req.params;
    const { interest } = req.body;

    const checkUser = await User.findOne({ _id: userId });

    if (!checkUser) {
      return res.status(404).json({
        message: "Not found user details",
      });
    }

    const updateDetails = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          interest: interest,
          onBoarding: true,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Update onBoarding details successfully",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to update on boadring", error: error.message });
  }
};
