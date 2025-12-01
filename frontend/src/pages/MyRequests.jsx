"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyRequests, cancelRequest } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Requests.css"

function MyRequests() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { requests } = useSelector((state) => state.leave)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (token) {
      dispatch(getMyRequests(token))
    }
  }, [dispatch, token])

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      dispatch(cancelRequest({ id, token })).then(() => {
        dispatch(getMyRequests(token))
      })
    }
  }

  const filteredRequests = filter === "all" ? requests : requests.filter((req) => req.status === filter)

  const getStatusClass = (status) => {
    return `status-${status}`
  }

  return (
    <Layout>
      <div className="requests-container">
        <h1>My Leave Requests</h1>

        <div className="filter-buttons">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All ({requests.length})
          </button>
          <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>
            Pending ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>
            Approved ({requests.filter((r) => r.status === "approved").length})
          </button>
          <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </button>
        </div>

        <div className="requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">No requests found</div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.leaveType.replace(/([A-Z])/g, " $1").trim()}</h3>
                    <p className="request-dates">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status ${getStatusClass(request.status)}`}>{request.status.toUpperCase()}</span>
                </div>

                <div className="request-body">
                  <p>
                    <strong>Days:</strong> {request.totalDays}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  {request.managerComment && (
                    <p>
                      <strong>Manager Comment:</strong> {request.managerComment}
                    </p>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="request-actions">
                    <button onClick={() => handleCancel(request._id)} className="btn-cancel">
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyRequests
