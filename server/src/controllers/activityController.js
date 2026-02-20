const Activity = require("../models/Activity")

exports.createActivity = async (req, res) => {
  try {
    const { activity_type, subject, class: className, name } =
      req.body

    const activity = await Activity.create({
      teacher_id: req.user.id,
      activity_type,
      subject,
      class: className,
      name,
      created_at: new Date()
    })

    res.json(activity)
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(400)
        .json({ msg: "Duplicate Activity Entry" })

    res.status(500).json(err)
  }
}

exports.weeklyTrends = async (req, res) => {
  const data = await Activity.aggregate([
    {
      $group: {
        _id: {
          week: {
            $week: "$created_at"
          },
          type: "$activity_type"
        },
        count: { $sum: 1 }
      }
    }
  ])

  res.json(data)
}


exports.teacherDetail = async (req, res) => {
  const teacherId = req.params.id

  const data = await Activity.aggregate([
    {
      $match: {
        teacher_id:
          require("mongoose").Types.ObjectId(
            teacherId
          )
      }
    },
    {
      $group: {
        _id: "$activity_type",
        count: { $sum: 1 }
      }
    }
  ])

  res.json(data)
}

exports.getMyActivities = async (req, res) => {

  const data = await Activity.find({
    teacher_id: req.user.id
  })
  .populate("teacher_id", "name")
  .sort({ created_at: -1 })

  res.json(data)
}



