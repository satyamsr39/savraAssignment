const Activity = require("../models/Activity")
const User = require("../models/User")
const mongoose = require("mongoose")
const generateText = require("../utils/gemini")

/* ============================= */
/* GET ALL TEACHERS */
/* ============================= */

exports.getTeachers = async (req, res) => {
  const teachers = await User.find({
    role: "teacher"
  }).select("_id name")

  res.json(teachers)
}

/* ============================= */
/* TEACHER SUMMARY WITH NAME */
/* ============================= */

exports.teacherSummary = async (req, res) => {
  const data = await Activity.aggregate([
    {
      $group: {
        _id: {
          teacher: "$teacher_id",
          type: "$activity_type"
        },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id.teacher",
        foreignField: "_id",
        as: "teacherInfo"
      }
    },
    {
      $unwind: "$teacherInfo"
    },
    {
      $group: {
        _id: "$_id.teacher",
        teacher_name: {
          $first: "$teacherInfo.name"
        },
        activities: {
          $push: {
            type: "$_id.type",
            count: "$count"
          }
        }
      }
    }
  ])

  res.json(data)
}

/* ============================= */
/* SUBJECT BREAKDOWN */
/* ============================= */

exports.subjectBreakdown = async (req, res) => {
  const teacherId = new mongoose.Types.ObjectId(
    req.params.id
  )

  const data = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: "$subject",
        count: { $sum: 1 }
      }
    }
  ])

  res.json(data)
}

/* ============================= */
/* CLASS BREAKDOWN */
/* ============================= */

exports.classBreakdown = async (req, res) => {
  const teacherId = new mongoose.Types.ObjectId(
    req.params.id
  )

  const data = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: "$class",
        count: { $sum: 1 }
      }
    }
  ])

  res.json(data)
}

/* ============================= */
/* WEEKLY TREND PER TEACHER */
/* ============================= */

exports.weeklyTrends = async (req, res) => {
  const teacherId = new mongoose.Types.ObjectId(
    req.params.id
  )

  const data = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: { week: { $week: "$created_at" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.week": 1 } }
  ])

  res.json(data)
}

/* ============================= */
/* ENHANCED WEEKLY TREND */
/* ============================= */

exports.enhancedWeeklyTrend = async (req, res) => {

  const raw = await Activity.aggregate([
    {
      $group: {
        _id: {
          week: { $week: "$created_at" },
          type: "$activity_type"
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.week": 1 } }
  ])

  let weeklyMap = {}

  raw.forEach(item => {
    const week = item._id.week
    const type = item._id.type
    const count = item.count

    if (!weeklyMap[week]) {
      weeklyMap[week] = {
        week,
        lesson: 0,
        quiz: 0,
        assessment: 0
      }
    }

    weeklyMap[week][type] = count
  })

  res.json(
    Object.values(weeklyMap)
  )
}

/* ============================= */
/* SIMPLE AI INSIGHT */
/* ============================= */

exports.aiInsight = async (req, res) => {
  try {
    const currentWeek = await Activity.countDocuments({
      created_at: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    })

    const prevWeek = await Activity.countDocuments({
      created_at: {
        $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    })

    const prompt = `
Current Week Activities: ${currentWeek}
Previous Week Activities: ${prevWeek}

Generate one concise professional dashboard insight.
`

    const insight = await generateText(prompt)

    res.json({ insight })

  } catch (err) {
    res.status(500).json({
      msg: "AI Insight Failed"
    })
  }
}

/* ============================= */
/* WEEKLY AI INSIGHT */
/* ============================= */

exports.weeklyAIInsight = async (req, res) => {

  try {

    const raw = await Activity.aggregate([
      {
        $group: {
          _id: {
            week: { $week: "$created_at" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.week": 1 } }
    ])

    // ---------- LOCAL AI ----------
    let insight = "Activity remained stable."

    if (raw.length >= 2) {

      const last = raw[raw.length - 1].count
      const prev = raw[raw.length - 2].count

      const diff = last - prev
      const percent =
        Math.abs(
          ((last - prev) / prev) * 100
        ).toFixed(0)

      if (diff > 0)
        insight =
          `Teacher activity increased by ${percent}% this week.`

      else if (diff < 0)
        insight =
          `Teacher activity dropped by ${percent}% this week.`

      else
        insight =
          "Teacher activity remained consistent this week."
    }

    // ---------- TRY GEMINI ----------
    try {

      const prompt = `
Weekly data:
${JSON.stringify(raw)}

Generate one short professional insight.
`

      const aiInsight =
        await generateText(prompt)

      return res.json({
        insight:
          aiInsight || insight
      })

    } catch (err) {

      console.log(
        "Gemini quota hit → using local AI"
      )

      return res.json({
        insight
      })
    }

  } catch (err) {

    return res.json({
      insight:
        "Weekly activity trend is steady."
    })
  }
}



exports.teacherDetails = async (req, res) => {

  const teacherId = new mongoose.Types.ObjectId(
    req.params.id
  )

  // Teacher basic info
  const teacher = await User.findById(
    teacherId
  ).select("_id name email")

  // Activity summary
  const summary = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: "$activity_type",
        count: { $sum: 1 }
      }
    }
  ])

  // Subject breakdown
  const subject = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: "$subject",
        count: { $sum: 1 }
      }
    }
  ])

  // Class breakdown
  const cls = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: "$class",
        count: { $sum: 1 }
      }
    }
  ])

  // Weekly trend
  const weekly = await Activity.aggregate([
    { $match: { teacher_id: teacherId } },
    {
      $group: {
        _id: { week: { $week: "$created_at" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.week": 1 } }
  ])

  res.json({
    teacher,
    summary,
    subject,
    cls,
    weekly
  })
}
