import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import "./AddEmployee.css";
import { FaUser, FaPhone, FaCalendarAlt, FaVenusMars, FaIdCard, FaEnvelope, FaBriefcase, FaMoneyCheckAlt, FaUserShield, FaCalendarCheck, FaUserTag, FaCheckCircle, FaExclamationCircle, FaCamera } from "react-icons/fa";

const steps = [
  "Personal Info",
  "Job Details",
  "Account Details"
];

const AddEmployee = () => {
  // Form state
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [idCard, setIdCard] = useState("");
  const [salary, setSalary] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  // Toast state
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add validation state
  const [errors, setErrors] = useState({});
  // Animation state
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  // Refs
  const glassCardRef = useRef(null);
  const progressBarRef = useRef(null);
  const toastRef = useRef(null);
  const formPageRef = useRef(null);

  // Progress bar width
  const progress = ((step + 1) / steps.length) * 100;

  // Form navigation functions

  // Form navigation
  const nextStep = () => {
    if (validateStep(step)) {
      setDirection('next');
      setAnimating(true);
      setTimeout(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
        setAnimating(false);
      }, 300);
    } else {
      showToast("error", "Please fill in all required fields correctly");
    }
  };
  
  const prevStep = () => {
    setDirection('prev');
    setAnimating(true);
    setTimeout(() => {
    setStep((s) => Math.max(s - 1, 0));
      setAnimating(false);
    }, 300);
  };

  // Toast helpers
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2200);
  };

  // Email sending
  const sendEmail = (email, password) => {
    const serviceID = "service_kmljolb";
    const templateID = "template_2kk7o9o";
    const userID = "B72ckKy5WBEG8tJ23";
    const templateParams = { email, password };
    emailjs.send(serviceID, templateID, templateParams, userID).catch(() => {});
  };

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 0: // Personal Info
        if (!name.trim()) newErrors.name = "Name is required";
        else if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name should only contain letters and spaces";
        
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^0\d{10}$/.test(phone)) newErrors.phone = "Please use PK Phone number format (03XXXXXXXXX)";
        
        if (!dob) newErrors.dob = "Date of birth is required";
        
        if (!gender) newErrors.gender = "Gender is required";
        
        if (!idCard.trim()) newErrors.idCard = "ID Card is required";
        else if (!/^\d{5}-\d{7}-\d{1}$/.test(idCard)) newErrors.idCard = "ID must be in format: XXXXX-XXXXXXX-X";
        
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address";
        break;

      case 1: // Job Details
        if (!designation.trim()) newErrors.designation = "Designation is required";
        
        if (!salary) newErrors.salary = "Salary is required";
        else if (isNaN(salary) || salary <= 0) newErrors.salary = "Please enter a valid salary amount";
        
        if (!role) newErrors.role = "Role is required";
        
        if (!joiningDate) newErrors.joiningDate = "Joining date is required";
        
        if (!employeeType) newErrors.employeeType = "Employee type is required";
        
        if (!bankDetails.trim()) newErrors.bankDetails = "Bank details are required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      showToast("error", "Please fill in all required fields correctly");
      return;
    }
    setIsSubmitting(true);
    const randomPassword = Math.floor(1000 + Math.random() * 9000);
    const formData = {
      name, phone, dob, gender, idCard, salary, bankDetails, email, password: randomPassword, designation, role, joiningDate, employeeType
    };
    const userData = { name, email, password: randomPassword, role };
    try {
      await axios.post("https://people-sync-33225-default-rtdb.firebaseio.com/employees.json", formData);
      await axios.post("https://people-sync-33225-default-rtdb.firebaseio.com/users.json", userData);
      sendEmail(email, randomPassword);
      showToast("success", "New Employee Added Successfully!");
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(0);
        setName(""); setPhone(""); setDob(""); setGender(""); setIdCard(""); setSalary(""); setBankDetails(""); setEmail(""); setDesignation(""); setRole(""); setJoiningDate(""); setEmployeeType("");
      }, 1500);
    } catch (error) {
      showToast("error", "Error adding employee. Try again.");
      setIsSubmitting(false);
    }
  };

  // Sectioned form content
  const renderStep = () => {
    let animationClass = "";
    
    if (animating) {
      animationClass = direction === 'next' ? 'exit' : 'prev-exit';
    } else {
      animationClass = direction === 'prev' ? 'prev-enter' : '';
    }

    const currentPage = (() => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="add-employee-section-title">Personal Information</div>
            <div className="add-employee-section-divider" />
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaUser className="add-employee-input-icon" />
                <input 
                  className={`add-employee-input ${errors.name ? 'error' : ''}`}
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Full Name" 
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
              <div className="add-employee-form-group">
                <FaPhone className="add-employee-input-icon" />
                <input 
                  className={`add-employee-input ${errors.phone ? 'error' : ''}`}
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                    placeholder="Phone Number" 
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaCalendarAlt className="add-employee-input-icon" />
                <input 
                  className={`add-employee-input ${errors.dob ? 'error' : ''}`}
                  type="date" 
                  value={dob} 
                  onChange={e => setDob(e.target.value)} 
                    style={{paddingLeft: "40px"}}
                />
                {errors.dob && <div className="error-message">{errors.dob}</div>}
              </div>
              <div className="add-employee-form-group">
                <FaVenusMars className="add-employee-input-icon" />
                <select 
                  className={`add-employee-input ${errors.gender ? 'error' : ''}`}
                  value={gender} 
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <div className="error-message">{errors.gender}</div>}
              </div>
            </div>
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaIdCard className="add-employee-input-icon" />
                <input 
                  className={`add-employee-input ${errors.idCard ? 'error' : ''}`}
                  type="text" 
                  value={idCard} 
                  onChange={e => setIdCard(e.target.value)} 
                    placeholder="National ID / SSN" 
                />
                {errors.idCard && <div className="error-message">{errors.idCard}</div>}
              </div>
              <div className="add-employee-form-group">
                <FaEnvelope className="add-employee-input-icon" />
                <input 
                  className={`add-employee-input ${errors.email ? 'error' : ''}`}
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Email Address" 
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="add-employee-section-title">Job Details</div>
            <div className="add-employee-section-divider" />
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaBriefcase className="add-employee-input-icon" />
                <input className="add-employee-input" type="text" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="Designation" required />
              </div>
              <div className="add-employee-form-group">
                <FaMoneyCheckAlt className="add-employee-input-icon" />
                <input className="add-employee-input" type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="Salary" required min="0" />
              </div>
            </div>
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaUserShield className="add-employee-input-icon" />
                <select className="add-employee-input" value={role} onChange={e => setRole(e.target.value)} required>
                  <option value="">Select Role</option>
                  <option value="hr">HR</option>
                  <option value="executive">Executive</option>
                  <option value="development team">Development Team</option>
                  <option value="sales team">Sales Team</option>
                  <option value="ai specialist">AI Specialist</option>
                </select>
              </div>
              <div className="add-employee-form-group">
                <FaCalendarCheck className="add-employee-input-icon" />
                  <input className="add-employee-input" type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} required style={{paddingLeft: "40px"}} />
              </div>
            </div>
            <div className="add-employee-form-row">
              <div className="add-employee-form-group">
                <FaUserTag className="add-employee-input-icon" />
                <select className="add-employee-input" value={employeeType} onChange={e => setEmployeeType(e.target.value)} required>
                  <option value="">Employee Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
              <div className="add-employee-form-group">
                <FaMoneyCheckAlt className="add-employee-input-icon" />
                <input className="add-employee-input" type="text" value={bankDetails} onChange={e => setBankDetails(e.target.value)} placeholder="Bank Details" required />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="add-employee-section-title">Review & Submit</div>
            <div className="add-employee-section-divider" />
            <ul style={{ color: '#a0aec0', fontSize: '1rem', width: '100%', marginBottom: 16 }}>
              <li><b>Name:</b> {name}</li>
              <li><b>Email:</b> {email}</li>
              <li><b>Phone:</b> {phone}</li>
              <li><b>Role:</b> {role}</li>
              <li><b>Designation:</b> {designation}</li>
              <li><b>Type:</b> {employeeType}</li>
            </ul>
          </>
        );
      default:
        return null;
    }
    })();

    return (
      <div ref={formPageRef} className={`form-page ${animationClass}`}>
        {currentPage}
      </div>
    );
  };

  return (
    <div className="add-employee-center-wrap">
      <div className="add-employee-glass-card" ref={glassCardRef}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          marginBottom: '20px', 
          fontWeight: '500', 
          color: '#fff', 
          textAlign: 'center',
          position: 'relative',
          display: 'inline-block',
          padding: '0 15px'
        }}>
          Add New Employee
          <span style={{
            display: 'none'
          }}></span>
        </h2>
        
        {/* Progress Bar */}
        <div className="add-employee-progress">
          {steps.map((s, i) => (
            <div 
              key={s} 
              className={`add-employee-progress-step${i > step ? " inactive" : ""}${i === step ? " active" : ""}`}
            >
              {i + 1}
            </div>
          ))}
          <div className="add-employee-progress-bar">
            <div 
              className="add-employee-progress-bar-inner" 
              ref={progressBarRef} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {renderStep()}
          <div style={{ display: "flex", width: "100%", marginTop: 15, gap: '12px' }}>
            {step > 0 && (
              <button 
                type="button" 
                className="add-employee-submit-btn" 
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.12)" }} 
                onClick={prevStep} 
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button 
                type="button" 
                className="add-employee-submit-btn" 
                onClick={nextStep} 
                disabled={isSubmitting}
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button 
                type="submit" 
                className="add-employee-submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ 
                      width: 18, 
                      height: 18, 
                      border: '2px solid #fff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%', 
                      display: 'inline-block', 
                      animation: 'spin 1s linear infinite' 
                    }}></span>
                    Submitting...
                  </span> : 
                  <><FaCheckCircle style={{ marginRight: 8 }} />Submit</>
                }
              </button>
            )}
          </div>
        </form>
        
        {toast.show && (
          <div className={`add-employee-toast ${toast.type}`} ref={toastRef}>
            {toast.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />} {toast.message}
          </div>
        )}
        
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        `}</style>
      </div>
    </div>
  );
};

export default AddEmployee;
