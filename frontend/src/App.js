import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import ApplyLeave from "./pages/ApplyLeave"
import MyRequests from "./pages/MyRequests"
import Profile from "./pages/Profile"
import PendingRequests from "./pages/PendingRequests"
import AllRequests from "./pages/AllRequests"

function AppContent() {
  const { token, user } = useSelector((state) => state.auth)

  const ProtectedRoute = ({ children, requiredRole }) => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken && !token) return <Navigate to="/login" />
    if (requiredRole && user?.role !== requiredRole) return <Navigate to="/login" />
    return children
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Employee Routes */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply-leave"
        element={
          <ProtectedRoute requiredRole="employee">
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute requiredRole="employee">
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pending-requests"
        element={
          <ProtectedRoute requiredRole="manager">
            <PendingRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-requests"
        element={
          <ProtectedRoute requiredRole="manager">
            <AllRequests />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
