import React, { useState, useEffect } from "react";
import "./Timer.css"; // Keep the CSS file
import axios from "axios";

// === NOTIFICATION LOGIC ===
// Custom Toast Notification for timer actions (start, pause, resume, stop)
const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="custom-toast" onClick={onClose}>
      {message}
    </div>
  );
};

const Timer = () => {
  // === STATE MANAGEMENT ===
  // user: current user info
  // time: timer value in seconds
  // isRunning: is the timer running?
  // isPaused: is the timer paused?
  // report: activity report text
  // toast: notification message
  const [user, setUser] = useState({});
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [report, setReport] = useState("");
  const [toast, setToast] = useState("");

  // === UTILITY FUNCTION ===
  // Safely get a number from localStorage, or 0 if not set
  const getNumberFromLS = (key) => Number(localStorage.getItem(key)) || 0;

  // === LOAD USER FROM LOCALSTORAGE ===
  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        setUser(JSON.parse(u));
        clearInterval(interval);
      }
    }, 500);
  }, []);

  // === TOAST HELPER ===
  // Shows a notification for 2.5 seconds
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // === TIMER LOGIC ===
  // Start the timer and create a timer entry in Firebase
  const startTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      localStorage.removeItem("isPaused");

      const now = new Date();
      localStorage.setItem("startTimestamp", now.getTime());
      localStorage.setItem("totalPausedDuration", "0");

      const timerData = {
        name: user.name,
        email: user.email,
        dateTime: now.toLocaleString(),
        timestamp: now.getTime(),
        start: true,
        pause: false,
        totalTimeMinutes: 0,
      };

      try {
        await axios.post(
          "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json",
          timerData
        );
        console.log("Timer data stored successfully");
        showToast("Timer started!");
      } catch (error) {
        console.error("Error storing timer data:", error);
      }
    }
  };

  // Pause the timer and update Firebase
  const pauseTimer = async () => {
    if (!isRunning) return;

    setIsPaused(true);
    setIsRunning(false);
    localStorage.setItem("isPaused", "true");
    localStorage.setItem("isRunning", "false");
    localStorage.setItem("pauseStartTimestamp", Date.now().toString());

    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
      );
      if (res.data) {
        const timerEntries = Object.entries(res.data).map(([id, obj]) => ({
          id,
          ...obj,
        }));

        const latestEntry = timerEntries
          .filter((entry) => entry.email === user.email)
          .pop();

        if (latestEntry) {
          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/timerdata/${latestEntry.id}.json`,
            { pause: true }
          );
          console.log("Timer paused successfully");
          showToast("Timer paused.");
        }
      }
    } catch (error) {
      console.error("Error pausing the timer:", error);
    }
  };

  // Resume the timer and update Firebase
  const resumeTimer = async () => {
    if (isRunning || !isPaused) return;

    setIsRunning(true);
    setIsPaused(false);
    localStorage.removeItem("isPaused");

    const pauseStart = getNumberFromLS("pauseStartTimestamp");
    if (pauseStart) {
      const now = Date.now();
      const pausedTime = now - pauseStart;
      const totalPaused = getNumberFromLS("totalPausedDuration") + pausedTime;
      localStorage.setItem("totalPausedDuration", totalPaused.toString());
      localStorage.removeItem("pauseStartTimestamp");
    }

    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
      );

      if (res.data) {
        const timerEntries = Object.entries(res.data).map(([id, obj]) => ({
          id,
          ...obj,
        }));
        const latestEntry = timerEntries
          .filter((entry) => entry.email === user.email)
          .pop();
        if (latestEntry) {
          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/timerdata/${latestEntry.id}.json`,
            { pause: false }
          );
          console.log("Timer resumed successfully");
          showToast("Timer resumed.");
        }
      }
    } catch (error) {
      console.error("Error resuming the timer:", error);
    }
  };

  // Stop the timer, require a report, and update Firebase
  const stopTimer = async () => {
    if (report.trim() === "") {
      showToast("Please submit your report to stop the timer.");
      return;
    }
    try {
      const res = await axios.get(
        "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
      );
      if (res.data) {
        const timerEntries = Object.entries(res.data).map(([id, obj]) => ({
          id,
          ...obj,
        }));

        const latestEntry = timerEntries
          .filter((entry) => entry.email === user.email)
          .pop();

        const stopTime = Date.now();
        const startTimestamp = getNumberFromLS("startTimestamp");
        const totalPausedDuration = getNumberFromLS("totalPausedDuration");
        const totalTimeMs = stopTime - startTimestamp - totalPausedDuration;
        const totalTimeMinutes = Math.floor(totalTimeMs / 60000);
        console.log(`Total Time Worked: ${totalTimeMinutes} minutes`);

        if (latestEntry) {
          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/timerdata/${latestEntry.id}.json`,
            { start: false, totalTimeMinutes: totalTimeMinutes }
          );

          const reportData = {
            ...latestEntry,
            report: report,
            totalTimeMinutes: totalTimeMinutes,
            stopTime: new Date().toLocaleString(),
          };

          await axios.post(
            "https://people-sync-33225-default-rtdb.firebaseio.com/reports.json",
            reportData
          );

          showToast("Timer stopped and report submitted.");
          setTime(0);
          setIsRunning(false);
          setIsPaused(false);
          setReport("");
          localStorage.removeItem("timer");
          localStorage.removeItem("timerStart");
          localStorage.removeItem("isRunning");
          localStorage.removeItem("isPaused");
          localStorage.removeItem("startTimestamp");
          localStorage.removeItem("pauseStartTimestamp");
          localStorage.removeItem("totalPausedDuration");
        }
      }
    } catch (error) {
      console.error("Error stopping the timer:", error);
    }
  };

  // === TIMER STATE PERSISTENCE ===
  // Loads timer state from localStorage and manages timer interval
  useEffect(() => {
    const savedTime = localStorage.getItem("timer");
    const savedStartTime = localStorage.getItem("timerStart");
    const savedRunning = localStorage.getItem("isRunning");
    const savedPaused = localStorage.getItem("isPaused");

    if (savedTime) setTime(parseInt(savedTime));
    if (savedRunning === "true") setIsRunning(true);
    if (savedPaused === "true") setIsPaused(true);

    if (savedRunning === "true" && savedStartTime && savedPaused !== "true") {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(savedStartTime)) / 1000
      );
      setTime((prev) => prev + elapsedTime);
    }

    let timerInterval;
    if (isRunning && !isPaused) {
      localStorage.setItem("timerStart", Date.now());
      localStorage.setItem("isRunning", "true");

      timerInterval = setInterval(() => {
        setTime((prev) => {
          localStorage.setItem("timer", prev + 1);
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, isPaused]);

  // === TIMER DISPLAY FORMATTING ===
  // Converts seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(1, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return { hrs, mins, secs };
  };
  const { hrs, mins, secs } = formatTime(time);

  // === STATUS TEXT ===
  // Returns a string for the timer status
  const getStatusText = () => {
    if (isRunning) return "Timer running";
    if (isPaused) return "Timer paused";
    return "Timer ready";
  };

  return (
    <>
      {/* === NOTIFICATION TOAST === */}
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="timer-container">
        {/* === TIMER HEADING === */}
        <h2 style={{ 
          fontSize: '1.75rem', 
          margin: '0 0 20px 0', 
          fontWeight: '500', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          Time Tracker
        </h2>
        {/* === STATUS INDICATOR === */}
        <div className="status-message" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "0.875rem",
          color: "#a0aec0",
          padding: "8px 16px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "20px"
        }}>
          <span className="status-dot" style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isRunning ? "#00d2ff" : isPaused ? "#fbbf24" : "#a0aec0",
            boxShadow: isRunning ? "0 0 10px #00d2ff" : "none",
            animation: isRunning ? "blink 2s infinite" : "none"
          }}></span>
          {getStatusText()}
        </div>
        
        {/* === TIMER DISPLAY === */}
        <div className="timer-display">
          <div>
            <div className="time-box">{hrs}</div>
            <div className="label">HOURS</div>
          </div>
          <div className="colon">:</div>
          <div>
            <div className="time-box">{mins}</div>
            <div className="label">MINUTES</div>
          </div>
          <div className="colon">:</div>
          <div>
            <div className="time-box">{secs}</div>
            <div className="label">SECONDS</div>
          </div>
        </div>

        {/* === TIMER BUTTONS === */}
        <div className="button-group">
          <button
            className="start-btn"
            onClick={startTimer}
            disabled={isRunning || isPaused}
          >
            Start
          </button>
          <button
            className="pause-btn"
            onClick={pauseTimer}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            className="resume-btn"
            onClick={resumeTimer}
            disabled={isRunning || !isPaused}
          >
            Resume
          </button>
          <button
            className="stop-btn"
            onClick={stopTimer}
            disabled={!isRunning && !isPaused}
          >
            Stop
          </button>
        </div>
        
        {/* === ACTIVITY REPORT === */}
        <div className="section-title">Activity Report</div>
        <div className="section-divider"></div>

        <div className="report-container">
          <textarea
            placeholder="Describe your activities during this time period..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="report-input"
          />
        </div>
        
        {/* === USER INFO === */}
        {user && user.name && (
          <div style={{ 
            marginTop: "20px", 
            textAlign: "right", 
            fontSize: "0.9rem", 
            color: "rgba(255, 255, 255, 0.6)",
            fontStyle: "italic"
          }}>
            Logged in as: {user.name}
          </div>
        )}
      </div>
    </>
  );
};

// Exportable pauseTimer for logout (localStorage only, no React state)
export async function pauseTimerForLogout() {
  const isRunning = localStorage.getItem("isRunning") === "true";
  if (!isRunning) return;
  localStorage.setItem("isPaused", "true");
  localStorage.setItem("isRunning", "false");
  localStorage.setItem("pauseStartTimestamp", Date.now().toString());
  // Update Firebase to set pause: true for the latest timer entry
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const res = await axios.get(
      "https://people-sync-33225-default-rtdb.firebaseio.com/timerdata.json"
    );
    if (res.data) {
      const timerEntries = Object.entries(res.data).map(([id, obj]) => ({
        id,
        ...obj,
      }));
      const latestEntry = timerEntries
        .filter((entry) => entry.email === user.email)
        .pop();
      if (latestEntry) {
        await axios.patch(
          `https://people-sync-33225-default-rtdb.firebaseio.com/timerdata/${latestEntry.id}.json`,
          { pause: true }
        );
      }
    }
  } catch (error) {
    // Optionally log error
    // console.error("Error pausing timer on logout:", error);
  }
}

export default Timer;
