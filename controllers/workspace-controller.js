const Workspace = require("../models/workspace.js");
const User = require("../models/user.js");

const create = async (req, res) => {
  try {
    const newWorkspace = {
      name: req.body.name,
      description: req.body.description,
      owner: req.user._id,
      members: [req.user._id],
    };

    const workspace = await Workspace.create(newWorkspace);

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner")
      .populate("members");

    res.status(201).json(populatedWorkspace);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const index = async (req, res) => {
  console.log("inside index");
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner")
      .populate("members")
      .sort({ createdAt: "desc" });

    res.status(200).json(workspaces);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const show = async (req, res) => {
  console.log("inside show");
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate("owner")
      .populate("members");

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    const isOwner = workspace.owner._id.equals(req.user._id);

    const isMember = workspace.members.some((member) =>
      member._id.equals(req.user._id),
    );

    if (!isOwner && !isMember) {
      return res.status(403).send("You don't have access to this workspace!");
    }

    res.status(200).json(workspace);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const update = async (req, res) => {
  console.log("inside update");
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
    };

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      updateData,
      { new: true },
    )
      .populate("owner")
      .populate("members");

    console.log(updatedWorkspace);

    res.status(200).json(updatedWorkspace);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({
      err: err.message,
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const deletedWorkspace = await Workspace.findByIdAndDelete(
      req.params.workspaceId,
    );

    res.status(200).json(deletedWorkspace);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const addMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const user = await User.findOne({
      username: req.body.username,
    });

    const alreadyMember = workspace.members.some((member) =>
      member.equals(user._id),
    );

    if (alreadyMember) {
      return res.status(400).json({
        err: "User is already a member",
      });
    }

    workspace.members.push(user._id);

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner")
      .populate("members");

    res.status(200).json(updatedWorkspace);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const user = await User.findById(req.params.userId);

    workspace.members = workspace.members.filter(
      (member) => !member.equals(user._id),
    );

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner")
      .populate("members");

    res.status(200).json(updatedWorkspace);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  deleteWorkspace,
  addMember,
  removeMember,
};
