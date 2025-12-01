"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllRequests } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Requests.css"

function AllRequests() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { allRequests } = useSelector((state) => state.leave)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (token) {
      dispatch(getAllRequests(token))
    }
  }, [dispatch, token])

  const filteredRequests = filter === "all" ? allRequests : allRequests.filter((req) => req.status === filter)

  const getStatusClass = (status) => {
    return `status-${status}`
  }

  return (
    <Layout>
      <div className="requests-container">
        <h1>All Leave Requests</h1>

        <div className="filter-buttons">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All ({allRequests.length})
          </button>
          <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>
            Pending ({allRequests.filter((r) => r.status === "pending").length})
          </button>
          <button className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>
            Approved ({allRequests.filter((r) => r.status === "approved").length})
          </button>
          <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>
            Rejected ({allRequests.filter((r) => r.status === "rejected").length})
          </button>
        </div>

        <div className="requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">No requests found</div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="request-card manager-view">
                <div className="request-header">
                  <div>
                    <h3>{request.userId?.name}</h3>
                    <p className="request-email">{request.userId?.email}</p>
                    <p className="request-dates">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status ${getStatusClass(request.status)}`}>{request.status.toUpperCase()}</span>
                </div>

                <div className="request-body">
                  <p>
                    <strong>Leave Type:</strong> {request.leaveType.replace(/([A-Z])/g, " $1").trim()}
                  </p>
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
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AllRequests
