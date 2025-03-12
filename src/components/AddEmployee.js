import React, { useState } from "react";
import axios from "axios";

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
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: name,
      phone: phone,
      dob: dob,
      gender: gender,
      idCard: idCard,
      salary: salary,
      bankDetails: bankDetails,
      email: email,
      password: password,
      department: department,
      role: role,
      joiningDate: joiningDate,
      employeeType: employeeType
    };
    
    try {
      await axios.post(
        "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json",
        formData
      );
      console.log("Data sent successfully");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }
  
  return (
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
              onChange={(e)=>setName(e.target.value)}
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
              onChange={(e)=>setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob"
            value={dob}
            onChange={(e)=>setDob(e.target.value)}
            required />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" 
            value={gender}
            onChange={(e)=>setGender(e.target.value)} required>
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
            onChange={(e)=>setIdCard(e.target.value)}
              placeholder="Enter ID/SSN"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              value={salary}
            onChange={(e)=>setSalary(e.target.value)}
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
            onChange={(e)=>setBankDetails(e.target.value)}
              placeholder="Enter bank account details"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
             placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="section">
        <h3>Job Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Job Role</label>
            <select id="role" 
            value={role}
            onChange={(e)=>setRole(e.target.value)}
             required>
              <option value="">Select role</option>
              <option value="manager">Manager</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="hr">HR</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={department}
            onChange={(e)=>setDepartment(e.target.value)}
              placeholder="Enter department name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="joining-date">Joining Date</label>
            <input type="date" id="joining-date" 
            value={joiningDate}
            onChange={(e)=>setJoiningDate(e.target.value)}
            required />
          </div>
          <div className="form-group">
            <label htmlFor="employee-type">Employee Type</label>
            <select id="employee-type" 
            value={employeeType}
            onChange={(e)=>setEmployeeType(e.target.value)} required>
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
  );
};

export default AddEmployee;
