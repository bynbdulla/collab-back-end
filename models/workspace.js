const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
  },
  { timestamps: true },
)

const Workspace = mongoose.model('Workspace', workspaceSchema)
module.exports = Workspace
