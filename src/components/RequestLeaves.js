import React, { useState, useEffect } from "react";
import "./RequestLeave.css";

const RequestLeave = ({ employeeId }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch employee leave history (Replace with actual API)
    fetch(`/api/leave-requests?employeeId=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaveRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave data:", error);
        setLoading(false);
      });
  }, [employeeId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeaveRequest = { employeeId, leaveType, startDate, endDate, reason, status: "PENDING" };

    // Submit leave request (Replace with actual API)
    fetch("/api/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeaveRequest),
    })
      .then((res) => res.json())
      .then((data) => {
        setLeaveRequests([...leaveRequests, data]); // Add new request to table
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
      })
      .catch((error) => console.error("Error submitting leave request:", error));
  };

  return (
    <div className="request-leave">
      <h2>Request Leave</h2>

      <form className='requestleaveform' onSubmit={handleSubmit}>
        <label>Leave Type:</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
          <option value="">Select Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
        </select>

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <label>Reason:</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />

        <button type="submit">Submit Request</button>
      </form>

      <h3>My Leave Requests</h3>
      <table>
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
            <tr><td colSpan="5">Loading leave history...</td></tr>
          ) : leaveRequests.length === 0 ? (
            <tr><td colSpan="5">No leave requests found.</td></tr>
          ) : (
            leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.leaveType}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.reason}</td>
                <td className={`status ${request.status.toLowerCase()}`}>{request.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestLeave;