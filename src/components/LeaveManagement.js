import React, { useState, useEffect } from "react";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leave requests from API (Replace with actual API)
    fetch("/api/leave-requests")
      .then((res) => res.json())
      .then((data) => {
        setLeaveRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleApproval = (id, status) => {
    fetch(`/api/leave-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updatedRequest) => {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === id ? { ...req, status: updatedRequest.status } : req
          )
        );
      })
      .catch((error) => console.error("Error updating leave status:", error));
  };

  return (
    <div className="leave-management">
      <h2>Leave Management</h2>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading leave requests...</td>
            </tr>
          ) : leaveRequests.length === 0 ? (
            <tr>
              <td colSpan="6">No leave requests found</td>
            </tr>
          ) : (
            leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.employeeName}</td>
                <td>{request.leaveType}</td>
                <td>{request.startDate} - {request.endDate}</td>
                <td>{request.leaveBalance} days</td>
                <td className={`status ${request.status.toLowerCase()}`}>
                  {request.status}
                </td>
                <td>
                  {request.status === "PENDING" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApproval(request.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleApproval(request.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>Processed</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;
