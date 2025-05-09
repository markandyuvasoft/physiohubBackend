// import Attendance from "../model/attendanceSchema.js";

// const getTodayAsUTCDate = () => {
//   const now = new Date();
//   const localMidnight = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate()
//   );
//   return new Date(
//     localMidnight.getTime() - localMidnight.getTimezoneOffset() * 60000
//   );
// };

// export const markAttendance = async (req, res) => {
    
//   try {
//     const studentId = req.user.id;

//     if (!studentId) {
//       return res.status(401).json({ message: "Student ID not found in token" });
//     }

//     const today = getTodayAsUTCDate();

//     const existingAttendance = await Attendance.findOne({
//       studentId,
//       date: today,
//     });

//     if (existingAttendance) {
//       return res
//         .status(200)
//         .json({ message: "Attendance already marked for today." });
//     }

//     const attendance = new Attendance({ studentId, date: today });
//     await attendance.save();

//     return res.status(200).json({ message: "Attendance marked successfully." });
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     return res
//       .status(500)
//       .json({ message: "Error marking attendance.", error: error.message });
//   }
// };

// const generateDatesTillToday = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth();
//   const today = now.getDate();

//   const dates = [];
//   for (let day = 1; day <= today; day++) {
//     const date = new Date(Date.UTC(year, month, day));
//     dates.push(date.toISOString().split("T")[0]);
//   }
//   return { dates, year, month };
// };


// export const getStudentMonthlyAttendance = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { dates, year, month } = generateDatesTillToday();

//     const monthStart = new Date(Date.UTC(year, month, 1));
//     const todayEnd = new Date();

//     const records = await Attendance.find({
//       studentId,
//       date: { $gte: monthStart, $lte: todayEnd },
//     });

//     const presentDates = records.map(
//       (rec) => new Date(rec.date).toISOString().split("T")[0]
//     );

//     const attendanceMap = {};
//     dates.forEach((date) => {
//       attendanceMap[date] = presentDates.includes(date) ? "present" : "absent";
//     });

//     return res.status(200).json({ attendance: attendanceMap });
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching attendance", error: error.message });
//   }
// };






// ------------------------------------

import Attendance from "../model/attendanceSchema.js";

const getTodayAsUTCDate = () => {
  const now = new Date();
  const localMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return new Date(
    localMidnight.getTime() - localMidnight.getTimezoneOffset() * 60000
  );
};

export const markAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!studentId) {
      return res.status(401).json({ message: "Student ID not found in token" });
    }

    const today = getTodayAsUTCDate();

    const existingAttendance = await Attendance.findOne({
      studentId,
      date: today,
    });

    if (existingAttendance) {
      return res
        .status(200)
        .json({ message: "Attendance already marked for today." });
    }

    const attendance = new Attendance({ studentId, date: today });
    await attendance.save();

    return res.status(200).json({ message: "Attendance marked successfully." });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res
      .status(500)
      .json({ message: "Error marking attendance.", error: error.message });
  }
};

export const getStudentMonthlyAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the first attendance record for the student to determine the starting date
    const firstAttendance = await Attendance.findOne({ studentId }).sort({ date: 1 });

    let startDate;
    if (firstAttendance) {
      startDate = new Date(firstAttendance.date);
    } else {
      // If no attendance records exist, return an empty attendance
      return res.status(200).json({ attendance: {} });
    }

    const now = new Date();
    const endDate = getTodayAsUTCDate();
    const attendanceRecords = await Attendance.find({
      studentId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const attendanceMap = {};
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const isPresent = attendanceRecords.some(
        (record) => new Date(record.date).toISOString().split("T")[0] === formattedDate
      );
      attendanceMap[formattedDate] = isPresent ? "present" : "absent";

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.status(200).json({ attendance: attendanceMap });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};