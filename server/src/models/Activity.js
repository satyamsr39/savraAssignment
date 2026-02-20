const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  activity_type: {
    type: String,
    enum: ["lesson", "quiz", "assessment"]
  },
  
  subject: String,
  class: String,
  created_at: Date
})

activitySchema.index(
  {
    teacher_id: 1,
    activity_type: 1,
    subject: 1,
    class: 1,
    created_at: 1,
   
  },
  { unique: true }
)

module.exports = mongoose.model("Activity", activitySchema)
