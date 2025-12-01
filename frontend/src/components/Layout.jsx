"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import "../styles/Layout.css"

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const isEmployeeRoute =
    location.pathname.includes("employee") ||
    location.pathname === "/apply-leave" ||
    location.pathname === "/my-requests" ||
    location.pathname === "/profile"
  const isManagerRoute =
    location.pathname.includes("manager") ||
    location.pathname === "/pending-requests" ||
    location.pathname === "/all-requests"

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>Leave Manager</h2>
          </div>
          <ul className="nav-menu">
            {user?.role === "employee" && (
              <>
                <li>
                  <button
                    onClick={() => navigate("/employee-dashboard")}
                    className={`nav-link ${location.pathname === "/employee-dashboard" ? "active" : ""}`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/apply-leave")}
                    className={`nav-link ${location.pathname === "/apply-leave" ? "active" : ""}`}
                  >
                    Apply Leave
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/my-requests")}
                    className={`nav-link ${location.pathname === "/my-requests" ? "active" : ""}`}
                  >
                    My Requests
                  </button>
                </li>
              </>
            )}
            {user?.role === "manager" && (
              <>
                <li>
                  <button
                    onClick={() => navigate("/manager-dashboard")}
                    className={`nav-link ${location.pathname === "/manager-dashboard" ? "active" : ""}`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/pending-requests")}
                    className={`nav-link ${location.pathname === "/pending-requests" ? "active" : ""}`}
                  >
                    Pending
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/all-requests")}
                    className={`nav-link ${location.pathname === "/all-requests" ? "active" : ""}`}
                  >
                    All Requests
                  </button>
                </li>
              </>
            )}
            <li>
              <button
                onClick={() => navigate("/profile")}
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout
