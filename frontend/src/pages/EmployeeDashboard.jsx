"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getEmployeeDashboard } from "../redux/slices/dashboardSlice"
import { getBalance, getMyRequests } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Dashboard.css"

function EmployeeDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { employeeStats, loading } = useSelector((state) => state.dashboard)
  const { balance, requests } = useSelector((state) => state.leave)

  useEffect(() => {
    if (token) {
      dispatch(getEmployeeDashboard(token))
      dispatch(getBalance(token))
      dispatch(getMyRequests(token))
    }
  }, [dispatch, token])

  const calculateLeaveInsights = () => {
    const approved = requests?.filter((r) => r.status === "approved") || []

    const leaveCount = { sickLeave: 0, casualLeave: 0, vacation: 0 }
    approved.forEach((req) => {
      const type = req.leaveType || ""
      if (type in leaveCount) {
        leaveCount[type]++
      }
    })

    const mostUsedType = Object.entries(leaveCount).reduce((a, b) => (b[1] > a[1] ? b : a), ["none", 0])[0]
    const total = Object.values(leaveCount).reduce((a, b) => a + b, 0) || 1

    // Monthly summary
    const monthlyData = {}
    approved.forEach((req) => {
      if (req.totalDays) {
        const month = new Date(req.startDate).toLocaleString("default", { month: "short" })
        monthlyData[month] = (monthlyData[month] || 0) + req.totalDays
      }
    })

    // Weekday pattern
    const weekdayCount = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    }
    approved.forEach((req) => {
      const day = new Date(req.startDate).toLocaleDateString("en-US", { weekday: "long" })
      if (day in weekdayCount) weekdayCount[day]++
    })

    const mostUsedDay = Object.entries(weekdayCount).reduce((a, b) => (b[1] > a[1] ? b : a), ["Unknown", 0])[0]
    const leastUsedDay = Object.entries(weekdayCount).reduce((a, b) => (b[1] < a[1] ? b : a), ["Unknown", 0])[0]

    return {
      mostUsedType,
      leaveCount,
      total,
      monthlyData,
      mostUsedDay,
      leastUsedDay,
    }
  }

  const insights = calculateLeaveInsights()

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
          <h1>Employee Dashboard</h1>
          <p className="dashboard-subtitle">Your leave overview and insights</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-value">{employeeStats?.totalRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value pending">{employeeStats?.pendingRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <p className="stat-value approved">{employeeStats?.approvedRequests || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <p className="stat-value rejected">{employeeStats?.rejectedRequests || 0}</p>
          </div>
        </div>

        <div className="leave-balance">
          <h2>Leave Balance</h2>
          <div className="balance-cards">
            <div className="balance-card">
              <span className="balance-label">Sick Leave</span>
              <span className="balance-value">{balance?.sickLeave || 0}</span>
              <span className="balance-unit">days</span>
            </div>
            <div className="balance-card">
              <span className="balance-label">Casual Leave</span>
              <span className="balance-value">{balance?.casualLeave || 0}</span>
              <span className="balance-unit">days</span>
            </div>
            <div className="balance-card">
              <span className="balance-label">Vacation</span>
              <span className="balance-value">{balance?.vacation || 0}</span>
              <span className="balance-unit">days</span>
            </div>
          </div>
        </div>

        <div className="insights-section">
          <h2>Your Leave Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <h3>Most Used Leave Type</h3>
              <p className="insight-value">
                {insights.mostUsedType === "none"
                  ? "No data yet"
                  : insights.mostUsedType.charAt(0).toUpperCase() + insights.mostUsedType.slice(1)}
              </p>
              {insights.total > 0 && (
                <div className="leave-breakdown">
                  <div className="breakdown-item">
                    <span>Sick:</span>
                    <span className="breakdown-percent">
                      {Math.round((insights.leaveCount.sickLeave / insights.total) * 100)}%
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span>Casual:</span>
                    <span className="breakdown-percent">
                      {Math.round((insights.leaveCount.casualLeave / insights.total) * 100)}%
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span>Vacation:</span>
                    <span className="breakdown-percent">
                      {Math.round((insights.leaveCount.vacation / insights.total) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="insight-card">
              <div className="insight-icon">📅</div>
              <h3>Monthly Leave Summary</h3>
              <div className="monthly-summary">
                {Object.entries(insights.monthlyData).length > 0 ? (
                  Object.entries(insights.monthlyData)
                    .slice(-3)
                    .map(([month, days]) => (
                      <div key={month} className="month-item">
                        <span className="month-name">{month}:</span>
                        <span className="month-days">{days} days</span>
                      </div>
                    ))
                ) : (
                  <p className="no-data">No leave history yet</p>
                )}
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">📆</div>
              <h3>Weekday Patterns</h3>
              <div className="weekday-summary">
                <div className="weekday-item">
                  <span className="label">Most leaves:</span>
                  <span className="value">{insights.mostUsedDay}</span>
                </div>
                <div className="weekday-item">
                  <span className="label">Least leaves:</span>
                  <span className="value">{insights.leastUsedDay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/apply-leave")} className="btn btn-primary">
            Apply for Leave
          </button>
          <button onClick={() => navigate("/my-requests")} className="btn btn-secondary">
            View My Requests
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default EmployeeDashboard
