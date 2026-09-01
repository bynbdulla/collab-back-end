const Meetings = require("../models/meetings.js");
const Workspace = require("../models/workspace.js");

const create = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    console.log(workspace, "found workspace");

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const newMeeting = {
      name: req.body.name,
      description: req.body.description,
      WorkspaceId: req.params.workspaceId,
      meetingDate: req.body.meetingDate,
      meetingTime: req.body.meetingTime,
      location: req.body.location,
    };

    const meeting = await Meetings.create(newMeeting);

    const populatedMeeting = await Meetings.findById(meeting._id).populate(
      "WorkspaceId",
    );

    res.status(201).json(populatedMeeting);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const index = async (req, res) => {
  try {
    const meetings = await Meetings.find({})
      .populate("WorkspaceId")
      .sort({ meetingDate: "asc" });
    console.log(meetings, "all meetings");

    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const show = async (req, res) => {
  try {
    const meeting = await Meetings.findById(req.params.meetingId).populate(
      "WorkspaceId",
    );

    if (!meeting) {
      return res.status(404).json({
        err: "Meeting not found",
      });
    }

    res.status(200).json(meeting);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const meeting = await Meetings.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({
        err: "Meeting not found",
      });
    }

    const workspace = await Workspace.findById(meeting.WorkspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const updatedMeeting = await Meetings.findByIdAndUpdate(
      req.params.meetingId,
      req.body,
      { new: true },
    ).populate("WorkspaceId");

    res.status(200).json(updatedMeeting);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meetings.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({
        err: "Meeting not found",
      });
    }

    const workspace = await Workspace.findById(meeting.WorkspaceId);

    if (!workspace) {
      return res.status(404).json({
        err: "Workspace not found",
      });
    }

    if (!workspace.owner.equals(req.user._id)) {
      return res.status(403).send("You're not the admin!");
    }

    const deletedMeeting = await Meetings.findByIdAndDelete(
      req.params.meetingId,
    );

    res.status(200).json(deletedMeeting);
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
  deleteMeeting,
};
