const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboardController")
const { managerOnly } = require("../middleware/authMiddleware")

router.get("/employee", dashboardController.getEmployeeDashboard)
router.get("/manager", managerOnly, dashboardController.getManagerDashboard)

module.exports = router
