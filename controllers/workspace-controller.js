const Workspace = require("../models/workspace.js")

const create = async (req, res) => {
  try {
    req.body.owner = req.user._id
    const workspace = await Workspace.create(req.body)
    workspace._doc.owner = req.user
    res.status(201).json(workspace)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const index = async (req, res) => {
  try {
    const workspaces = await Workspace.find({})
      .populate("owner")
      .sort({ createdAt: "desc" })
    res.status(200).json(workspaces)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const show = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate([
      'owner',
    ])
    res.status(200).json(workspace)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const update = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!")
    }

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      req.body,
      { new: true }
    )

    updatedWorkspace._doc.owner = req.user

    res.status(200).json(updatedWorkspace)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!")
    }

    const deletedWorkspace = await Workspace.findByIdAndDelete(req.params.workspaceId)
    res.status(200).json(deletedWorkspace)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

module.exports = {
    create,
    index,
    show,
    update,
    deleteWorkspace,
}