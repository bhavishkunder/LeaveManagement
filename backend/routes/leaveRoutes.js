const express = require("express")
const router = express.Router()
const leaveController = require("../controllers/leaveController")
const { managerOnly } = require("../middleware/authMiddleware")

// Employee routes
router.post("/", leaveController.applyLeave)
router.get("/my-requests", leaveController.getMyRequests)
router.delete("/:id", leaveController.cancelRequest)
router.get("/balance", leaveController.getBalance)

// Manager routes
router.get("/all", managerOnly, leaveController.getAllRequests)
router.get("/pending", managerOnly, leaveController.getPendingRequests)
router.put("/:id/approve", managerOnly, leaveController.approveLeave)
router.put("/:id/reject", managerOnly, leaveController.rejectLeave)

module.exports = router
