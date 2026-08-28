const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
    },
    WorkspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Tasks = mongoose.model("Tasks", tasksSchema);
module.exports = Tasks;
