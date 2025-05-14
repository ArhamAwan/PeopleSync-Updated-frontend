import React, { useState } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import "./AddEmployee.css";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [idCard, setIdCard] = useState("");
  const [salary, setSalary] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const sendEmail = (email, password) => {
    const serviceID = "service_kmljolb";
    const templateID = "template_2kk7o9o";
    const userID = "B72ckKy5WBEG8tJ23";

    const templateParams = {
      email: email,
      password: password,
    };

    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomPassword = Math.floor(1000 + Math.random() * 9000);
    const formData = {
      name: name,
      phone: phone,
      dob: dob,
      gender: gender,
      idCard: idCard,
      salary: salary,
      bankDetails: bankDetails,
      email: email,
      password: randomPassword,
      designation: designation,
      role: role,
      joiningDate: joiningDate,
      employeeType: employeeType,
    };
    const userData = {
      name,
      email,
      password,
      role,
    };

    try {
      await axios.post(
        "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json",
        formData
      );
      console.log("Data sent successfully");

      await axios.post(
        "https://people-sync-33225-default-rtdb.firebaseio.com/users.json",
        userData
      );
      console.log("New User Added.");
      sendEmail(email, randomPassword);

      alert("New Employee Added Successfuly !");

      setName("");
      setPhone("");
      setDob("");
      setGender("");
      setIdCard("");
      setSalary("");
      setBankDetails("");
      setEmail("");
      setPassword("");
      setDesignation("");
      setRole("");
      setJoiningDate("");
      setEmployeeType("");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="main-cont">
      <form className="add-employee-form" onSubmit={handleSubmit}>
        <h4 className="myTableHeader animate__animated animate__lightSpeedInLeft">
          Add Employee Details
        </h4>

        {/* Personal Information */}
        <div className="section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                pattern="^[A-Za-z\s]+$"
                title="Name should only contain Alphabets and Spaces.."
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (e.g. 03XXXXXXXXX)"
                required
                pattern="^0\d{10}$"
                title="Please use PK Phone number format, start with 0 and have 11 digits."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ position: "relative" }}>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {!joiningDate && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "20px",
                    fontSize: "12px",
                    color: "#999",
                    pointerEvents: "none",
                  }}
                >
                  Date of Birth
                </span>
              )}
            </div>
            <div className="form-group">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="national-id"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="National ID / SSN (XXXXX-XXXXXXX-X)"
                required
                pattern="^\d{5}-\d{7}-\d{1}$"
                title="National ID Number must be in the format: XXXXX-XXXXXXX-X"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Salary"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="bank-details"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder="Bank Account Details"
                required
                pattern="^[A-Za-z\s&.]+-\s*\d{14}$"
                title="Format: Bank Name - Account Number (e.g., Bank Name - 14-digit-number)"
              />
            </div>
          </div>

          {/* <div className="form-row"> */}

          {/* <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Auto Generated Password"
                disabled
              />
            </div> */}
          {/* </div> */}
        </div>

        {/* Job Details */}
        <div className="section">
          <h3>Job Details</h3>
          <div className="form-row">
            <div className="form-group">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                <option value="marketing team">Marketing Team</option>
                <option value="development team">Development Team</option>
                <option value="ai specialist">AI Specialist</option>
                <option value="sales team">Sales Team</option>
                <option value="hr">HR</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Designation"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ position: "relative" }}>
              <input
                type="date"
                id="joining-date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {!joiningDate && (
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "20px",
                    fontSize: "12px",
                    color: "#999",
                    pointerEvents: "none",
                  }}
                >
                  Joining Date
                </span>
              )}
            </div>
            <div className="form-group">
              <select
                id="employee-type"
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                required
              >
                <option value="">Select Employee Type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contractor">Contractor</option>
                <option value="intern">Intern</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
