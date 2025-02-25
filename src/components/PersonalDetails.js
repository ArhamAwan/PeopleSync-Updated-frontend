import React, { useState } from "react";
import "./PersonalDetails.css";


const PersonalDetails = () => {
  // Sample Employee Data (This would typically come from a database)
  const initialData = {
    name: "John Doe",
    position: "Software Engineer",
    department: "Development",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "1234 Main St, New York, NY",
    image: "public/pexels-mart-production-7709149.jpg", // Replace with actual image
    documents: [
      { name: "Resume.pdf", url: "#" },
      { name: "Contract.pdf", url: "#" },
      { name: "ID Proof.pdf", url: "#" },
    ],
  };

  // State for Employee Data & Editing
  const [employee, setEmployee] = useState(initialData);
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
      <img 
  src={`${process.env.PUBLIC_URL}/pexels-mart-production-7709149.jpg`} 
  alt="Employee" 
  className="profile-image" 
/>

        <h2>{employee.name}</h2>
        <p className="position">{employee.position} - {employee.department}</p>
      </div>

      {/* Personal Information */}
      <div className="info-section">
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
      </div>

      {/* Documents Section */}
      <div className="documents-section">
        <h3>Uploaded Documents</h3>
        <ul>
          {employee.documents.map((doc, index) => (
            <li key={index}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">📄 {doc.name}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* HR Approval Buttons (Simulated) */}
      {requestStatus === "Pending" && (
        <div className="hr-actions">
          <button className="approve-btn" onClick={() => handleHRAction("Approved")}>Approve</button>
          <button className="reject-btn" onClick={() => handleHRAction("Rejected")}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
