import User from "../model/userSchema.js";

export const getAllRegisterUser_Teachers = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!adminId) {
      return res.status(401).json({ message: "Admin ID not found in token" });
    }

    const checkAll = await User.find({}).select("-interest -password -isEmail_verification -isNumber_verification -onBoarding -isForget -otp")

    const FilterStudent = await checkAll.filter(
      (student) => student.role === "Student"
    );

    const filterTeacher = await checkAll.filter(
      (teacher) => teacher.role === "Teacher"
    );

    if (FilterStudent.length > 0 || filterTeacher.length > 0) {
      res.status(200).json({
        message: "all student and teachers",
        allStudents: FilterStudent,
        allTeachers: filterTeacher,
      });
    } else {
      res.status(404).json({
        message: "not for any",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};




export const makeATeacher = async (req, res) => {
    
    try {
      const adminId = req.user.id;

      const {role} = req.body
  
      const { studentId } = req.params;
  
      if (!adminId) {
        return res.status(401).json({ message: "Admin ID not found in token" });
      }
  
      const changeTeacher = await User.findByIdAndUpdate(
        { _id: studentId },
        {
          $set: {
            role
          },
        },
        { new: true }
      );
  
      if (changeTeacher) {
        res.status(200).json({
          message: "role change successfully",
        });
      
      } else {
        res.status(404).json({
          message: "not found details",
        });
      }
    
  } catch (error) {
      res.status(500).json({
        message: "internal server error",
      });
    }
  };
  