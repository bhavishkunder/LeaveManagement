"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getManagerDashboard } from "../redux/slices/dashboardSlice"
import { getAllRequests } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Dashboard.css"

function ManagerDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { managerStats, loading } = useSelector((state) => state.dashboard)
  const { allRequests } = useSelector((state) => state.leave)

  useEffect(() => {
    if (token) {
      dispatch(getManagerDashboard(token))
      dispatch(getAllRequests(token))
    }
  }, [dispatch, token])

  const calculateTeamMetrics = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())

    const thisWeekEnd = new Date(thisWeekStart)
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6)

    const approved = allRequests?.filter((r) => r.status === "approved") || []

    // Team on leave today
    const onLeaveToday = new Set()
    approved.forEach((req) => {
      const start = new Date(req.startDate)
      const end = new Date(req.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)

      if (start <= today && today <= end) {
        onLeaveToday.add(req.userId)
      }
    })

    // Team on leave this week
    const onLeaveThisWeek = new Set()
    approved.forEach((req) => {
      const start = new Date(req.startDate)
      const end = new Date(req.endDate)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)

      if (
        (start >= thisWeekStart && start <= thisWeekEnd) ||
        (end >= thisWeekStart && end <= thisWeekEnd) ||
        (start <= thisWeekStart && end >= thisWeekEnd)
      ) {
        onLeaveThisWeek.add(req.userId)
      }
    })

    // Detect overlapping leaves
    const dateMap = {}
    approved.forEach((req) => {
      const start = new Date(req.startDate)
      const end = new Date(req.endDate)

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split("T")[0]
        if (!dateMap[dateKey]) dateMap[dateKey] = []
        dateMap[dateKey].push(req.userId)
      }
    })

    const overlaps = []
    Object.entries(dateMap).forEach(([date, userIds]) => {
      if (userIds.length > 2) {
        overlaps.push({
          date,
          count: userIds.length,
          uniqueCount: new Set(userIds).size,
        })
      }
    })

    overlaps.sort((a, b) => new Date(b.date) - new Date(a.date))

    return {
      onLeaveToday: onLeaveToday.size,
      onLeaveThisWeek: onLeaveThisWeek.size,
      overlaps: overlaps.slice(0, 3),
    }
  }

  const teamMetrics = calculateTeamMetrics()

  if (loading)
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    )

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p className="dashboard-subtitle">Team leave overview and insights</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p className="stat-value">{managerStats?.totalEmployees || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-value">{managerStats?.totalRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value pending">{managerStats?.pendingRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <p className="stat-value approved">{managerStats?.approvedRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <p className="stat-value rejected">{managerStats?.rejectedRequests || 0}</p>
          </div>
        </div>

        <div className="team-insights-section">
          <h2>Team Leave Insights</h2>
          <div className="team-insights-grid">
            <div className="team-insight-card">
              <div className="insight-icon">👥</div>
              <h3>Team Leave Load</h3>
              <div className="load-metrics">
                <div className="load-item">
                  <span className="load-label">On leave today:</span>
                  <span className="load-value">{teamMetrics.onLeaveToday}</span>
                  <span className="load-unit">employees</span>
                </div>
                <div className="load-item">
                  <span className="load-label">This week:</span>
                  <span className="load-value">{teamMetrics.onLeaveThisWeek}</span>
                  <span className="load-unit">employees</span>
                </div>
              </div>
            </div>

            <div className="team-insight-card">
              <div className="insight-icon">⚠️</div>
              <h3>Leave Overlap Detection</h3>
              <div className="overlaps-summary">
                {teamMetrics.overlaps.length > 0 ? (
                  teamMetrics.overlaps.map((overlap, idx) => (
                    <div key={idx} className="overlap-item">
                      <span className="overlap-date">
                        {new Date(overlap.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="overlap-count">{overlap.uniqueCount} team members on leave</span>
                    </div>
                  ))
                ) : (
                  <p className="no-overlaps">No significant overlaps detected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/pending-requests")} className="btn btn-primary">
            Review Pending Requests
          </button>
          <button onClick={() => navigate("/all-requests")} className="btn btn-secondary">
            View All Requests
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ManagerDashboard
