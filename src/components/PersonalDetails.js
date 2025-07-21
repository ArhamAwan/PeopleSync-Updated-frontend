// === PERSONAL DETAILS ===
// Shows and allows editing of the logged-in user's personal information.
import React, { useEffect, useState } from "react";
import "./PersonalDetails.css";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { FaUser, FaIdCard, FaBriefcase, FaCalendarAlt, FaCheck } from "react-icons/fa";

const PersonalDetails = () => {
  const [user, setUser] = useState({});
  const [employee, setEmployee] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState(null);

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
          const employeesData = response.data;

          // Find the employee matching the user (you can adjust based on what unique info you have, like email or id)
          const currentEmployee = Object.values(employeesData).find(
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
      icon: <FaUser />
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      pattern: /^0\d{10}$/,
      title: "11 digits starting with 0.",
      icon: <FaUser />
    },
    { 
      key: "dob", 
      label: "Date of Birth", 
      type: "date",
      icon: <FaCalendarAlt />
    },
    { 
      key: "gender", 
      label: "Gender", 
      type: "text",
      icon: <FaUser />
    },
    {
      key: "idCard",
      label: "ID Card",
      type: "text",
      pattern: /^\d{5}-\d{7}-\d{1}$/,
      title: "Format: XXXXX-XXXXXXX-X",
      icon: <FaIdCard />
    },
    {
      key: "designation",
      label: "Job Role",
      type: "text",
      icon: <FaBriefcase />
    },
    {
      key: "role",
      label: "Department",
      type: "text",
      pattern: /^(Marketing Team|Development Team|AI Specialist|Sales Team)$/,
      title:
        "Departments are: Marketing Team, Development Team, AI Specialist, Sales Team",
      icon: <FaBriefcase />
    },
    { 
      key: "employeeType", 
      label: "Employee Type", 
      type: "text",
      icon: <FaUser />
    },
    { 
      key: "joiningDate", 
      label: "Joining Date", 
      type: "date",
      icon: <FaCalendarAlt />
    },
    { 
      key: "salary", 
      label: "Salary", 
      type: "number",
      icon: <FaUser />
    },
    { 
      key: "bankDetails", 
      label: "Bank Details", 
      type: "text",
      icon: <FaUser />
    },
    { 
      key: "email", 
      label: "Email", 
      type: "email",
      icon: <FaUser />
    },
    { 
      key: "password", 
      label: "Password", 
      type: "text",
      icon: <FaUser />
    },
  ];

  // Define field groups for categorized cards
  const fieldGroups = [
    {
      title: "Personal Info",
      fields: ["name", "phone", "dob", "gender"],
    },
    {
      title: "Job Info",
      fields: ["idCard", "designation", "role"],
    },
    {
      title: "Employment",
      fields: ["employeeType", "joiningDate", "salary"],
    },
    {
      title: "Banking",
      fields: ["bankDetails"],
    },
    {
      title: "Account",
      fields: ["email", "password"],
    },
  ];

  // Helper to get field meta by key
  const getFieldMeta = (key) => fields.find((f) => f.key === key);

  // === EDIT LOGIC ===
  // Handles editing of personal fields, including validation and update requests.
  const handleEdit = (fieldKey) => {
    setEditField(fieldKey);
    setEditValue(employee[fieldKey]);
    setModalField(fieldKey);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (editValue.trim() !== "") {
      updateHandler(employee.name, employee.email, editField, editValue);
    }
    setEditField(null);
    setModalOpen(false);
    setModalField(null);
  };

  const handleModalCancel = () => {
    setEditField(null);
    setModalOpen(false);
    setModalField(null);
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

  // === MODAL/PORTAL ===
  // Uses a modal popup for editing fields, styled to match the app's theme.
  return (
    <div className="personal-details-container">
      {/* Header Section */}
      <div className="search-row">
        <div className="heading-em">
          <h4 className="myTableHeader">
            Personal Information
          </h4>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-glass-card">
        <div className="profile-card-content">
          <div className="profile-avatar">
            {employee.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{employee.name}</h2>
            <div className="profile-meta">
              <span className="profile-role">{employee?.role?.toUpperCase()}</span>
              {employee.designation && <span className="profile-designation">{employee.designation}</span>}
            </div>
            <span className="profile-email">{employee.email}</span>
          </div>
        </div>
      </div>

      {/* Info Card Grid */}
      <div className="info-card-grid">
        {fieldGroups.map((group) => (
          <div className="info-card glass-card" key={group.title}>
            <div className="info-card-title">{group.title}</div>
            <div className="info-card-fields">
              {group.fields.map((key) => {
                const meta = getFieldMeta(key);
                if (!meta) return null;
                return (
                  <div className="info-field-row" key={key}>
                    <div className="info-field-label">
                      <span className="info-field-icon">{meta.icon}</span>
                      <span>{meta.label}</span>
                    </div>
                    <div className="info-field-value">
                      {key === modalField && modalOpen ? (
                        <span className="edit-in-modal">{employee[key]}</span>
                      ) : key === "password" ? (
                        <span className="password-dots">••••••••</span>
                      ) : key === "role" ? (
                        employee[key]?.toUpperCase()
                      ) : (
                        employee[key]
                      )}
                    </div>
                    <div className="info-field-action">
                      <button
                        className="details-edit-btn"
                        title="Edit"
                        onClick={() => handleEdit(key)}
                      >
                        <EditIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Field Modal Popup */}
      {modalOpen && modalField && (
        <div className="edit-modal-overlay" onClick={handleModalCancel}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-title">Edit {getFieldMeta(modalField)?.label}</div>
            <div className="edit-modal-input">
              {modalField === "role" ? (
                <select
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  required
                  autoFocus
                >
                  <option value="">Select Department</option>
                  <option value="marketing team">Marketing Team</option>
                  <option value="development team">Development Team</option>
                  <option value="ai specialist">AI Specialist</option>
                  <option value="sales team">Sales Team</option>
                  <option value="hr">HR</option>
                </select>
              ) : (
                <input
                  type={getFieldMeta(modalField)?.type || "text"}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  pattern={getFieldMeta(modalField)?.pattern ? getFieldMeta(modalField).pattern.source : undefined}
                  title={getFieldMeta(modalField)?.title || ""}
                  required
                  autoFocus
                />
              )}
            </div>
            <div className="edit-modal-actions">
              <button className="details-save-btn" onClick={handleModalSave}><FaCheck /> Save</button>
              <button className="details-cancel-btn" onClick={handleModalCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* HR Approval Section - Only show if there are pending requests */}
      {requestStatus === "Pending" && (
        <div className="glass-card">
          <div className="card-header">
            <h2>Pending Requests</h2>
          </div>
          <div className="hr-actions">
            <button
              className="approve-btn"
              onClick={() => handleHRAction("Approved")}
            >
              Approve Changes
            </button>
            <button
              className="reject-btn"
              onClick={() => handleHRAction("Rejected")}
            >
              Reject Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;



