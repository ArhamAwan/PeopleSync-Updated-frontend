import React, { useState, useEffect } from "react";
import "./login.css";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";
import logo from "../utilities/logo-png.png";
import loginImg from "../utilities/login-img.png";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Snackbar,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = (props) => {
  const [user, setUser] = useState(null);

  // States
  const [role, setRole] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // const handleRole = (event) => {
  //   setRole(event.target.value);

  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlertMessage("");

    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/employees.json"
      );

      const users = res.data
        ? Object.values(res.data).filter(
            (user) =>
              user.email?.trim().toLowerCase() == email.trim().toLowerCase() &&
              user.password == pass 
          )
        : [];

      console.log(users);

      if (users.length > 0) {
        setIsLoggingIn(true);
        setTimeout(() => {
          const { password, ...userWithoutPassword } = users[0];
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          if (userWithoutPassword.role === "hr") navigate("/dashboard");
          else navigate("/timer");
        }, 600); // match exit animation duration
      } else {
        setAlertMessage("Invalid email or password.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAlertMessage("Something went wrong. Please try again.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u != null) {
      if (u?.role === "hr") {
        setUser(JSON.parse(u));
        navigate("/dashboard");
      } else {
        setUser(JSON.parse(u));
        navigate("/timer");
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.add("login-page");
    document.documentElement.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
      document.documentElement.classList.remove("login-page");
    };
  }, []);

  return (
    <div className="login-background">
      <div className="container-main2">
        <div className={`login-glass-card${isLoggingIn ? " login-glass-card-exit" : ""}`}>
          <img
            src={logo}
            alt="PeopleSync Logo"
            className="login-logo"
          />
          <h4>Welcome to PeopleSync</h4>
          <p>Please enter your credentials to continue</p>
          
          <Form.Group style={{ width: "100%", marginBottom: "20px" }}>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
          </Form.Group>
          
          <Form.Group style={{ width: "100%", marginBottom: "20px" }}>
            <Form.Control
              type="password"
              placeholder="Password"
              value={pass}
              onChange={handlePass}
            />
          </Form.Group>
          
          {msg && <h5 className="heading1">{msg}</h5>}
          
          <div className="text-center pt-1 mb-4 pb-1" style={{ width: "100%" }}>
            <Button
              className="sign-in-btn"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
          
          <Snackbar
            open={showAlert}
            autoHideDuration={6000}
            onClose={() => setShowAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert 
              onClose={() => setShowAlert(false)} 
              severity="error"
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff'
                }
              }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Login;
