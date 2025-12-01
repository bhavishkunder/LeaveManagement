const LeaveRequest = require("../models/LeaveRequest")
const User = require("../models/User")

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  return days
}

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body
    const userId = req.userId

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const totalDays = calculateDays(startDate, endDate)
    const user = await User.findById(userId)

    if (user.leaveBalance[leaveType] < totalDays) {
      return res.status(400).json({ message: "Insufficient leave balance" })
    }

    const newLeaveRequest = new LeaveRequest({
      userId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: "pending",
    })

    await newLeaveRequest.save()

    res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequest: newLeaveRequest,
    })
  } catch (error) {
    res.status(500).json({ message: "Error applying leave", error: error.message })
  }
}

exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.userId
    const requests = await LeaveRequest.find({ userId }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message })
  }
}

exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const leaveRequest = await LeaveRequest.findById(id)
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    if (leaveRequest.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending requests" })
    }

    await LeaveRequest.findByIdAndDelete(id)

    res.json({ message: "Leave request cancelled successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error cancelling request", error: error.message })
  }
}

exports.getBalance = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)
    res.json(user.leaveBalance)
  } catch (error) {
    res.status(500).json({ message: "Error fetching balance", error: error.message })
  }
}

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find()
      .populate("userId", "name email")
      .populate("managerId", "name email")
      .sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message })
  }
}

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ status: "pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error: error.message })
  }
}

exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params
    const managerId = req.userId
    const { managerComment } = req.body

    const leaveRequest = await LeaveRequest.findById(id)
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ message: "Can only approve pending requests" })
    }

    leaveRequest.status = "approved"
    leaveRequest.managerId = managerId
    leaveRequest.managerComment = managerComment || ""
    await leaveRequest.save()

    // Deduct leave from user balance
    const user = await User.findById(leaveRequest.userId)
    user.leaveBalance[leaveRequest.leaveType] -= leaveRequest.totalDays
    await user.save()

    res.json({ message: "Leave approved successfully", leaveRequest })
  } catch (error) {
    res.status(500).json({ message: "Error approving leave", error: error.message })
  }
}

exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params
    const managerId = req.userId
    const { managerComment } = req.body

    const leaveRequest = await LeaveRequest.findById(id)
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ message: "Can only reject pending requests" })
    }

    leaveRequest.status = "rejected"
    leaveRequest.managerId = managerId
    leaveRequest.managerComment = managerComment || ""
    await leaveRequest.save()

    res.json({ message: "Leave rejected successfully", leaveRequest })
  } catch (error) {
    res.status(500).json({ message: "Error rejecting leave", error: error.message })
  }
}
