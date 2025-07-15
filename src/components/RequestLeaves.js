import React, { useState, useEffect } from "react";
import "./RequestLeave.css";
import axios from "axios";
import bgIcon from "../utilities/leavess.jpg";

const RequestLeave = () => {
  const [user, setUser] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaveRequests = async (email) => {
    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json"
      );
      const data = res.data
        ? Object.entries(res.data)
            .map(([id, obj]) => ({ id, ...obj }))
            .filter((leave) => leave.employeeEmail === email)
        : [];
      setLeaveRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalLeaves = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLeaveRequest = {
      employeeName: user.name,
      employeeEmail: user.email,
      leaveType,
      startDate,
      endDate,
      reason,
      totalLeaves,
      statusHr: "PENDING",
      statusExec: "PENDING",
    };

    try {
      await axios.post(
        "https://people-sync-33225-default-rtdb.firebaseio.com/leaves.json",
        newLeaveRequest
      );
      console.log("Leave request submitted:", newLeaveRequest);

      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      alert("Leave Request Submitted Successfully!");

      // Refresh the leave requests list
      fetchLeaveRequests(user.email);
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        const userObject = JSON.parse(u);
        setUser(userObject);
        fetchLeaveRequests(userObject?.email);
        clearInterval(interval);
      }
    }, 500);
  }, []);

  const approvedLeavesTotal = leaveRequests
  .filter((req) => req.statusHr === "APPROVED" && req.statusExec === "APPROVED")
  .reduce((sum, req) => sum + req.totalLeaves, 0);


  return (
    <div className="request-leave">
      <h4 className="myTableHeader">Request Leave</h4>

      {/* Leave Stats Card */}
      <div className="glass-card">
        <div className="card-header">
          <h2>Leave Summary</h2>
        </div>
        <div className="leave-stats">
          <div className="leave-stats-image"></div>
          <div className="leave-stats-info">
            <h2>Total Leaves Credited</h2>
            <p className="online-count">{approvedLeavesTotal}</p>
            <p>Days approved this year</p>
          </div>
        </div>
      </div>

      {/* Leave Request Form */}
      <div className="glass-card">
        <div className="card-header">
          <h2>Request New Leave</h2>
        </div>
        <form className="requestleaveform" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Please provide a reason for your leave request"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>

      {/* Leave History */}
      <div className="glass-card">
        <div className="card-header">
          <h2>My Leave Requests</h2>
        </div>
        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading leave history...</td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="5">No leave requests found.</td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.leaveType}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span
                        className={`status ${
                          request.statusHr === "PENDING" ||
                          request.statusExec === "PENDING"
                            ? "pending"
                            : request.statusHr === "REJECTED" ||
                              request.statusExec === "REJECTED"
                            ? "rejected"
                            : "approved"
                        }`}
                      >
                        {request.statusHr === "PENDING" ||
                        request.statusExec === "PENDING"
                          ? "PENDING"
                          : request.statusHr === "REJECTED" ||
                            request.statusExec === "REJECTED"
                          ? "REJECTED"
                          : request.statusHr === "APPROVED" &&
                            request.statusExec === "APPROVED"
                          ? "APPROVED"
                          : ""}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestLeave;
