const Tasks = require("../models/tasks.js");
const User = require("../models/user.js");
const Workspace = require("../models/workspace.js");

const create = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.body.workspaceId);
    if (!workspace) {
      return res.status(404).json({ err: "workspace not found" });
    }
    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const user = await User.findOne({
      username: req.body.assignedTo,
    });
    console.log(user);

    const newTask = {
      name: req.body.name,
      description: req.body.description,
      priority: req.body.priority,
      workspaceId: req.body.workspaceId,
      assignedTo: user._id,
      owner: req.user._id,
      status: req.body.status,
    };

    const task = await Tasks.create(newTask);
    console.log(task);

    const populatedTask = await Tasks.findById(task._id)
      .populate("assignedTo")
      .populate("workspaceId")
      .populate("owner");

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const index = async (req, res) => {
  try {
    const tasks = await Tasks.find({})
      .populate("assignedTo")
      .populate("workspaceId")
      .populate("owner")
      .sort({ createdAt: "desc" });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const show = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.taskId)
      .populate("assignedTo")
      .populate("workspaceId")
      .populate("owner");

    if (!task) {
      return res.status(404).json({ err: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const update = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ err: "Task not found" });
    }

    if (!task.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      priority: req.body.priority,
      workspaceId: req.body.workspaceId,
      status: req.body.status,
    };

    // If a different user is assigned
    if (req.body.username) {
      const user = await User.findOne({
        username: req.body.username,
      });

      if (!user) {
        return res.status(404).json({ err: "User not found" });
      }

      updateData.assignedTo = user._id;
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      req.params.taskId,
      updateData,
      { new: true },
    )
      .populate("assignedTo")
      .populate("WorkspaceId")
      .populate("owner");

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ err: "Task not found" });
    }

    if (!task.owner.equals(req.user._id)) {
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
