import React, { useEffect, useState } from "react";
import "./PersonalDetails.css";
import axios from "axios";

const PersonalDetails = () => {
  const [user, setUser] = useState({});
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const u = localStorage.getItem("user");

    if (u) {
      const user = JSON.parse(u);
      setUser(user);

      const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(
            `https://people-sync-33225-default-rtdb.firebaseio.com/employees.json`
          );
          const employees = response.data;

          // Find the employee matching the user (you can adjust based on what unique info you have, like email or id)
          const currentEmployee = Object.values(employees).find(
            (employee) => employee.email === user.email
          );

          if (currentEmployee) {
            setEmployee(currentEmployee);
            console.log("Employee data:", currentEmployee);
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };

      fetchEmployeeData();
    }
  }, []);

  const initialData = {
    name: user?.name,
    position: user.role,
    department: "Development",
    email: user.email,
    phone: "+1 234 567 890",
    address: "1234 Main St, New York, NY",
    image: "public/pexels-mart-production-7709149.jpg", // Replace with actual image
    documents: [
      { name: "Resume.pdf", url: "#" },
      { name: "Contract.pdf", url: "#" },
      { name: "ID Proof.pdf", url: "#" },
    ],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(initialData);
  const [requestStatus, setRequestStatus] = useState(null); // Pending | Approved | Rejected

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit request to HR
  const handleSubmit = () => {
    setIsEditing(false);
    setRequestStatus("Pending");
    alert("Update request sent to HR for approval.");
  };

  // Simulating HR Approval or Rejection
  const handleHRAction = (status) => {
    if (status === "Approved") {
      setEmployee(updatedData);
      alert("HR has approved the changes.");
    } else {
      alert("HR has rejected the changes.");
    }
    setRequestStatus(status);
  };

  return (
    <div className="personal-details-container">
      {/* Profile Section */}

      <div className="profile-section">
        <div>
          <div
            className="profile-circle"
            style={{ margin: "auto", marginTop: "20px" }}
          >
            {employee.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <h2>{employee.name}</h2>
        <p className="position">
          {employee.role} - {employee.department}
        </p>
      </div>

      {/* Personal Information */}
      {/* <div className="info-section">
        <h3>Personal Information</h3>
        {isEditing ? (
          <>
            <input type="text" name="email" value={updatedData.email} onChange={handleChange} placeholder="Email" />
            <input type="text" name="phone" value={updatedData.phone} onChange={handleChange} placeholder="Phone" />
            <input type="text" name="address" value={updatedData.address} onChange={handleChange} placeholder="Address" />
            <button className="save-btn" onClick={handleSubmit}>Submit for Approval</button>
          </>
        ) : (
          <>
            <div className="info-item"><strong>Email:</strong> {employee.email}</div>
            <div className="info-item"><strong>Phone:</strong> {employee.phone}</div>
            <div className="info-item"><strong>Address:</strong> {employee.address}</div>
            {requestStatus === "Pending" ? (
              <p className="pending-status">Update request pending HR approval</p>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
            )}
          </>
        )}
      </div> */}

      <div>
        <div className="popup-header">
          <h2 style={{ color: "red" }}>Personal Information</h2>
          {/* <button
                className="edit-icon"
                onClick={() => handleEdit(employee)}
              >
                ✎
              </button> */}
        </div>

        <div className="employee-details">
          <p>
            <strong>Full Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>
          <p>
            <strong>Date of Birth:</strong> {employee.dob}
          </p>
          <p>
            <strong>Gender:</strong> {employee.gender}
          </p>
          <p>
            <strong>ID Card:</strong> {employee.idCard}
          </p>
          <p>
            <strong>Job Role:</strong> {employee.role}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Employee Type:</strong> {employee.employeeType}
          </p>
          <p>
            <strong>Joining Date:</strong> {employee.joiningDate}
          </p>
          <p>
            <strong>Salary:</strong> {employee.salary}
          </p>
          <p>
            <strong>Bank Details:</strong> {employee.bankDetails}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Password:</strong> {employee.password}
          </p>
        </div>
      </div>

      {/* Documents Section */}
      {/* <div className="documents-section">
        <h3>Uploaded Documents</h3>
        <ul>
          {employee.documents.map((doc, index) => (
            <li key={index}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">📄 {doc.name}</a>
            </li>
          ))}
        </ul>
      </div> */}

      {/* HR Approval Buttons (Simulated) */}
      {requestStatus === "Pending" && (
        <div className="hr-actions">
          <button
            className="approve-btn"
            onClick={() => handleHRAction("Approved")}
          >
            Approve
          </button>
          <button
            className="reject-btn"
            onClick={() => handleHRAction("Rejected")}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
