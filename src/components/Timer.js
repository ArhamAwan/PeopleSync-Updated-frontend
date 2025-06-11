import React, { useState, useEffect } from "react";
import "./Timer.css"; // Keep the CSS file
import axios from "axios";

const Timer = () => {
  const [user, setUser] = useState({});
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [report, setReport] = useState("");

  // Utility function (optional, for cleaner code)
  const getNumberFromLS = (key) => Number(localStorage.getItem(key)) || 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const u = localStorage.getItem("user");
      if (u != null) {
        setUser(JSON.parse(u));
        clearInterval(interval);
      }
    }, 500);
  }, []);

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
      } catch (error) {
        console.error("Error storing timer data:", error);
      }
    }
  };

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
          alert("Timer paused successfully.");
        }
      }
    } catch (error) {
      console.error("Error pausing the timer:", error);
    }
  };

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
          alert("Timer resumed successfully.");
        }
      }
    } catch (error) {
      console.error("Error resuming the timer:", error);
    }
  };

  const stopTimer = async () => {
    if (report.trim() === "") {
      alert("Please submit your report to stop the timer.");
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

          alert("Timer stopped and report submitted.");
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

  // Status text based on timer state
  const getStatusText = () => {
    if (isRunning) return "Timer running";
    if (isPaused) return "Timer paused";
    return "Timer ready";
  };

  return (
    <>
      <div className="timer-container">
        <h2 style={{ 
          fontSize: '1.75rem', 
          marginBottom: '20px', 
          fontWeight: '500', 
          color: '#fff', 
          textAlign: 'center',
          position: 'relative',
          display: 'inline-block',
          padding: '0 15px',
          width: '100%'
        }}>
          Time Tracker
        </h2>
        
        {/* Status indicator matching Dashboard style */}
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
            disabled={!isRunning}
          >
            Stop
          </button>
        </div>
        
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
        
        {/* User info */}
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

export default Timer;
