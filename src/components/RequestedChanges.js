import React, { useState, useEffect } from "react";
import "./LeaveManagement.css";
import axios from "axios";

const RequestedChanges = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json"
      );
      const data = res.data
        ? Object.entries(res.data).map(([id, obj]) => ({ id, ...obj }))
        : [];
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproval = async (request, action) => {
    try {
      const { id, email, fieldName, fieldValue } = request;

      if (action === "approve") {
        // Step 1: Update request status to APPROVED
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/requests/${id}.json`,
          { status: "APPROVED" }
        );
        // Step 2: Find employee by email and update their field
        const res = await axios.get(
          "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json"
        );
        const employees = res.data;

        const employeeEntry = Object.entries(employees).find(
          ([_, emp]) => emp.email === email
        );

        if (employeeEntry) {
          const [empId] = employeeEntry;

          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/employees/${empId}.json`,
            { [fieldName]: fieldValue }
          );
          console.log(
            `Field "${fieldName}" updated to "${fieldValue}" for employee ${email}`
          );
        } else {
          console.warn(`Employee with email ${email} not found.`);
        }
      } else if (action === "reject") {
        // Step 1: Update request status to REJECTED
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/requests/${id}.json`,
          { status: "REJECTED" }
        );
      }

      // Step 3: Refresh requests
      const updatedRes = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json"
      );
      const updatedData = updatedRes.data
        ? Object.entries(updatedRes.data).map(([id, obj]) => ({ id, ...obj }))
        : [];
      setRequests(updatedData);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  return (
    <div className="leave-management">
      <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
        Requested Changes
      </h4>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Field</th>
            <th>Requested Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading leave requests...</td>
            </tr>
          ) : requests.length === 0 ? (
            <tr>
              <td colSpan="6">No leave requests found</td>
            </tr>
          ) : (
            [...requests].reverse().map((request) => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.fieldName}</td>
                <td>{request.fieldValue}</td>
                {/* <td>{request.leaveBalance} days</td> */}
                <td className={`status ${request.status.toLowerCase()}`}>
                  {request.status}
                </td>
                <td>
                  {request.status === "pending" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApproval(request, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleApproval(request, "reject")}
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

export default RequestedChanges;
