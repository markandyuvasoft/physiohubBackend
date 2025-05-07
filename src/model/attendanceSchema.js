import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true }); 

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
