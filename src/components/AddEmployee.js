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
      sendEmail();

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
    <div>
      <form className="add-employee-form" onSubmit={handleSubmit}>
        <h2>Add Employee</h2>

        {/* Personal Information */}
        <div className="section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                pattern="^0\d{10}$"
                title="Please use PK Phone number format,start swith 0 and have 11 digits."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="national-id">National ID / SSN</label>
              <input
                type="text"
                id="national-id"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="Enter National ID Number"
                required
                pattern="^\d{5}-\d{7}-\d{1}$"
                title="National ID Number must be in the format: XXXXX-XXXXXXX-X"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter salary amount"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bank-details">Bank Details</label>
              <input
                type="text"
                id="bank-details"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder="Enter bank account details"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Auto Generated.."
                disabled
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="section">
          <h3>Job Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Department</label>
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
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Enter Designation"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="joining-date">Joining Date</label>
              <input
                type="date"
                id="joining-date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="employee-type">Employee Type</label>
              <select
                id="employee-type"
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contractor">Contractor</option>
                <option value="intern">Intern</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddEmployee;
