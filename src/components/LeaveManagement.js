import React, { useState, useEffect } from "react";
import "./LeaveManagement.css";
import axios from "axios";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
        );
        const data = res.data
          ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
          : [];
        setLeaveRequests(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleApproval = async (id, action) => {
    try {
      const status = action === "APPROVED" ? "APPROVED" : "REJECTED";

      await axios.patch(
        `https://people-sync-33225-default-rtdb.firebaseio.com/leaves/${id}.json`,
        { status }
      );
      console.log(`Leave request ${status.toLowerCase()}`);

      // Fetch fresh leave data after approval/rejection
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
      );
      const data = res.data
        ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
        : [];
      setLeaveRequests(data); // Update the state with fresh data
    } catch (error) {
      console.error(
        `Error ${
          action === "approve" ? "approving" : "rejecting"
        } leave request:`,
        error
      );
    }
  };

  return (
    <div className="leave-management">
      <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
        Leave Management
      </h4>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Days</th>
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
            [...leaveRequests].reverse().map((request) => (
              <tr key={request.id}>
                <td>{request.employeeName}</td>
                <td>{request.leaveType}</td>
                <td>
                  {request.startDate} - {request.endDate}
                </td>
                <td>{request.totalLeaves}</td>
                {/* <td>{request.leaveBalance} days</td> */}
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
