"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPendingRequests, approveLeave, rejectLeave } from "../redux/slices/leaveSlice"
import Layout from "../components/Layout"
import "../styles/Requests.css"

function PendingRequests() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { pendingRequests } = useSelector((state) => state.leave)
  const [comment, setComment] = useState({})
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (token) {
      dispatch(getPendingRequests(token))
    }
  }, [dispatch, token])

  const handleApprove = (id) => {
    dispatch(
      approveLeave({
        id,
        comment: comment[id] || "",
        token,
      }),
    ).then(() => {
      dispatch(getPendingRequests(token))
      setComment({})
    })
  }

  const handleReject = (id) => {
    dispatch(
      rejectLeave({
        id,
        comment: comment[id] || "",
        token,
      }),
    ).then(() => {
      dispatch(getPendingRequests(token))
      setComment({})
    })
  }

  return (
    <Layout>
      <div className="requests-container">
        <h1>Pending Leave Requests ({pendingRequests.length})</h1>

        <div className="requests-list">
          {pendingRequests.length === 0 ? (
            <div className="no-requests">No pending requests</div>
          ) : (
            pendingRequests.map((request) => (
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
                  <span className="status status-pending">PENDING</span>
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
                </div>

                <div className="manager-actions">
                  <div className="comment-section">
                    <label>Manager Comment (Optional)</label>
                    <textarea
                      placeholder="Add a comment..."
                      value={comment[request._id] || ""}
                      onChange={(e) => setComment({ ...comment, [request._id]: e.target.value })}
                      rows="2"
                    />
                  </div>

                  <div className="action-buttons">
                    <button onClick={() => handleApprove(request._id)} className="btn-approve">
                      Approve
                    </button>
                    <button onClick={() => handleReject(request._id)} className="btn-reject">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default PendingRequests
