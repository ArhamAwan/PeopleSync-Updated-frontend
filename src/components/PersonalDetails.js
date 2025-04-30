import React, { useEffect, useState } from "react";
import "./PersonalDetails.css";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';


const PersonalDetails = () => {
  const [user, setUser] = useState({});
  const [employee, setEmployee] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

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

  // Simulating HR Approval or Rejection
  const handleHRAction = (status) => {
    if (status === "Approved") {
      // setEmployee(updatedData);
      alert("HR has approved the changes.");
    } else {
      alert("HR has rejected the changes.");
    }
    setRequestStatus(status);
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      pattern: /^[A-Za-z ]+$/,
      title: "Only alphabets allowed.",
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      pattern: /^0\d{10}$/,
      title: "11 digits starting with 0.",
    },
    { key: "dob", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender", type: "text" },
    {
      key: "idCard",
      label: "ID Card",
      type: "text",
      pattern: /^\d{5}-\d{7}-\d{1}$/,
      title: "Format: XXXXX-XXXXXXX-X",
    },
    {
      key: "designation",
      label: "Job Role",
      type: "text",
    },
    {
      key: "role",
      label: "Department",
      type: "text",
      pattern: /^(Marketing Team|Development Team|AI Specialist|Sales Team)$/,
      title:
        "Departments are: Marketing Team, Development Team, AI Specialist, Sales Team",
    },
    { key: "employeeType", label: "Employee Type", type: "text" },
    { key: "joiningDate", label: "Joining Date", type: "date" },
    { key: "salary", label: "Salary", type: "number" },
    { key: "bankDetails", label: "Bank Details", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "password", label: "Password", type: "text" },
  ];

  const handleEdit = (fieldKey) => {
    setEditField(fieldKey);
    setEditValue(employee[fieldKey]);
  };

  const handleSave = (fieldName) => {
    if (editValue.trim() !== "") {
      updateHandler(employee.name, employee.email, fieldName, editValue);
    }
    setEditField(null);
  };

  const updateHandler = async (name, email, fieldName, fieldValue) => {
    try {
      const requestData = {
        name,
        email,
        fieldName,
        fieldValue,
        status: "pending",
      };

      await axios.post(
        "https://people-sync-33225-default-rtdb.firebaseio.com/requests.json",
        requestData
      );

      alert("Update request sent successfully.");
    } catch (error) {
      console.error("Error sending update request:", error);
    }
  };

  return (
    <div className="personal-details-container">
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
          {employee?.role !== "hr" &&
            `${employee?.role?.toUpperCase()} - ( ${employee.designation})`}
        </p>
      </div>

      <div>
        <div className="popup-header">
        <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
        Personal Information</h4>
        </div>

        <table className="employee-details-table">
          <tbody>
            {fields.map(({ key, label, type, pattern, title }) => (
              <tr key={key}>
                <td>
                  <strong>{label}:</strong>
                </td>
                <td>
                  {editField === key ? (
                    <input
                      type={type}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      pattern={pattern ? pattern.source : undefined}
                      title={title || ""}
                      required
                    />
                  ) : key === "role" ? (
                    employee[key]?.toUpperCase()
                  ) : (
                    employee[key]
                  )}
                </td>
                <td>
                  {editField === key ? (
                    <button className="btn1" onClick={() => handleSave(key)} style={{color:'#007bff'}}>✔</button>
                  ) : (
                    <button className="btn1" onClick={() => handleEdit(key)}><EditIcon style={{color:'#007bff'}}/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {/* {requestStatus === "Pending" && (
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
      )} */}
    </div>
  );
};

export default PersonalDetails;
