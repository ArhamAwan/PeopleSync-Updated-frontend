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
        "https://people-sync-33225-default-rtdb.firebaseio.com/users.json"
      );

      const users = res.data
        ? Object.values(res.data).filter(
            (user) => user.email === email && user.password === pass
          )
        : [];

      if (users.length > 0) {
        const { password, ...userWithoutPassword } = users[0];
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        if (userWithoutPassword.role === "hr") navigate("/dashboard");
        else navigate("/timer");
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

  return (
    <Container fluid className="d-flex vh-100" style={{ padding: "0px" }}>
      <Row
        className="w-100"
        style={{
          display: "flex",
          gap: "0px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Col
          md={7}
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            height: "100vh",
            backgroundColor: "#f8f9fa",
            width: "60%",
            textAlign: "center",
          }}
        >
          <div className="text-center" style={{ textAlign: "center" }}>
            <img
              src={logo}
              style={{ width: "190px", height: "200px" }}
              alt="logo"
            />
            <h4 className="mt-1 mb-3 pb-1" style={{ fontWeight: "bold" }}>
              Welcome To Growth Guild
            </h4>
          </div>

          <p className="mb-9 pb-4">Please Enter Your Details</p>

          <Form.Group style={{ width: "70%", margin: "auto" }}>
            <Form.Control
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                backgroundColor: "#EAE2E2",
              }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
          </Form.Group>

          <Form.Group style={{ width: "70%", margin: "auto" }}>
            <Form.Control
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                backgroundColor: "#EAE2E2",
              }}
              type="password"
              placeholder="Password"
              value={pass}
              onChange={handlePass}
            />
          </Form.Group>

          {/* <FormControl fullWidth style={{ width: "200px" }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Age"
              onChange={handleRole}
            >
              <MenuItem value={"hr"}>HR</MenuItem>
              <MenuItem value={"emp"}>Employee</MenuItem>
            </Select>
          </FormControl> */}

          <h5 className="heading1">{msg}</h5>

          <div
            className="text-center pt-1 mb-5 mt-4 pb-1"
            style={{ width: "60%", margin: "auto" }}
          >
            <Button
              className="sign-in-btn mb-4 gradient-custom-2"
              onClick={handleLogin}
              style={{
                width: "80%",
                outline: "none",
                border: "none",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              Sign In
            </Button>
          </div>
        </Col>

        <Col
          md={5}
          className="d-flex flex-column justify-content-center align-items-center text-white gradient-custom-3"
          style={{ height: "100%", overflow: "hidden", width: "40%" }}
        >
          <img
            src={loginImg}
            alt="logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Col>
        <Snackbar
          open={showAlert}
          autoHideDuration={15000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setShowAlert(false)} severity="error">
            {alertMessage}
          </Alert>
        </Snackbar>
      </Row>
    </Container>
  );
};

export default Login;
