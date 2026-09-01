const mongoose = require("mongoose");

const meetingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    WorkspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
    },
    meetingDate: {
        type: Date,
        required: true,
    },
    meetingTime: {
        type: String,
        required: true,
    },
    location: {
        type: String
    },
  },
  { timestamps: true },
)

const Meetings = mongoose.model('Meetings', meetingsSchema)
module.exports = Meetings
