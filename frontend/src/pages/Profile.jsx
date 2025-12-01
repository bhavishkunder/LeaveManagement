import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import "../styles/Profile.css"

function Profile() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Layout>
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <h2>{user?.name}</h2>
              <p className="role">{user?.role?.toUpperCase()}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Email</span>
              <span className="value">{user?.email}</span>
            </div>

            <div className="detail-item">
              <span className="label">Role</span>
              <span className="value">{user?.role === "employee" ? "Employee" : "Manager"}</span>
            </div>

            {user?.role === "employee" && (
              <>
                <h3>Leave Balance</h3>
                <div className="balance-grid">
                  <div className="balance-item">
                    <span className="label">Sick Leave</span>
                    <span className="value">{user?.leaveBalance?.sickLeave} days</span>
                  </div>
                  <div className="balance-item">
                    <span className="label">Casual Leave</span>
                    <span className="value">{user?.leaveBalance?.casualLeave} days</span>
                  </div>
                  <div className="balance-item">
                    <span className="label">Vacation</span>
                    <span className="value">{user?.leaveBalance?.vacation} days</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
