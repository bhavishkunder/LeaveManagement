const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.role = decoded.role
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}

const managerOnly = (req, res, next) => {
  if (req.role !== "manager") {
    return res.status(403).json({ message: "Only managers can access this" })
  }
  next()
}

module.exports = { authMiddleware, managerOnly }
