"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { applyLeave } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Form.css"

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("sickLeave")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [successMessage, setSuccessMessage] = useState("") // Added success message state
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.leave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startDate || !endDate || !reason) {
      alert("Please fill all required fields")
      return
    }

    const result = await dispatch(
      applyLeave({
        data: { leaveType, startDate, endDate, reason },
        token,
      }),
    )
    if (result.payload) {
      setSuccessMessage("Leave request submitted successfully!")
      setTimeout(() => {
        navigate("/my-requests")
      }, 2000)
    }
  }

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      return days > 0 ? days : 0
    }
    return 0
  }

  return (
    <Layout>
      <div className="form-wrapper">
        <div className="form-content">
          <h1>Apply for Leave</h1>

          {successMessage && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div className="success-text">{successMessage}</div>
              <div className="success-progress"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="leave-form">
            <div className="form-group">
              <label>Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="sickLeave">Sick Leave</option>
                <option value="casualLeave">Casual Leave</option>
                <option value="vacation">Vacation</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            {startDate && endDate && (
              <div className="days-info">
                <p>
                  Number of days: <strong>{calculateDays()}</strong> day(s)
                </p>
              </div>
            )}

            <div className="form-group">
              <label>Reason for Leave</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                placeholder="Enter the reason for your leave request"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ApplyLeave
