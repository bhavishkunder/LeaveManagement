const LeaveRequest = require("../models/LeaveRequest")
const User = require("../models/User")

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)

    const leaveRequests = await LeaveRequest.find({ userId })

    const stats = {
      totalRequests: leaveRequests.length,
      pendingRequests: leaveRequests.filter((r) => r.status === "pending").length,
      approvedRequests: leaveRequests.filter((r) => r.status === "approved").length,
      rejectedRequests: leaveRequests.filter((r) => r.status === "rejected").length,
      leaveBalance: user.leaveBalance,
      recentRequests: leaveRequests.slice(0, 5),
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard", error: error.message })
  }
}

exports.getManagerDashboard = async (req, res) => {
  try {
    const allRequests = await LeaveRequest.find().populate("userId", "name email").sort({ createdAt: -1 })

    const employees = await User.find({ role: "employee" })

    const stats = {
      totalEmployees: employees.length,
      totalRequests: allRequests.length,
      pendingRequests: allRequests.filter((r) => r.status === "pending").length,
      approvedRequests: allRequests.filter((r) => r.status === "approved").length,
      rejectedRequests: allRequests.filter((r) => r.status === "rejected").length,
      recentRequests: allRequests.slice(0, 10),
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard", error: error.message })
  }
}
