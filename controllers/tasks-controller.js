const Tasks = require("../models/tasks.js");
const User = require("../models/user.js");
const Workspace = require("../models/workspace.js");

const create = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.body.workspaceId)
    const users = await User.find()
    const user = users.filter(user => user.username === req.body.username)

    const newTask = {
        name: req.body.name ,
        description: req.body.description ,
        priority: req.body.priority,
        workspaceId: req.body.WorkspaceId,
        assignedTo: req.body._id
    }

    const task = await Tasks.create(newTask)
    res.status(201).json(task)

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const index = async (req, res) => {
  try {
    const tasks = await Tasks.find({})
      .populate("assignedTo")
      .populate("WorkspaceId")
      .sort({ createdAt: "desc" });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const show = async (req, res) => {
  try {
    const tasks = await Tasks.findById(req.params.taskId).populate("assignedTo")
      .populate("WorkspaceId");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const update = async (req, res) => {
  try {
    const tasks = await Tasks.findById(req.params.taskId);

    if (!tasks.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true },
    );

    updatedtask._doc.owner = req.user;

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const tasks = await Tasks.findById(req.params.taskId);

    if (!tasks.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const deletedTask = await Tasks.findByIdAndDelete(req.params.taskId);
    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  deleteTask,
};
