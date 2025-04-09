import React, { useState, useEffect } from "react";
import "./Timer.css"; // Keep the CSS file
import axios from "axios";

const Timer = () => {
  const [user, setUser] = useState({});
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [report, setReport] = useState("");

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
      const timerData = {
        name: user.name,
        email: user.email,
        dateTime: now.toLocaleString(),
        timestamp: now.getTime(),
        start: true,
        pause: false,
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
    if (isRunning || !isPaused) return; // Prevent if already running or not paused

    setIsRunning(true);
    setIsPaused(false);
    localStorage.removeItem("isPaused");

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

        if (latestEntry) {
          await axios.patch(
            `https://people-sync-33225-default-rtdb.firebaseio.com/timerdata/${latestEntry.id}.json`,
            { start: false }
          );

          const reportData = {
            name: user.name,
            email: user.email,
            report: report,
            dateTime: new Date().toLocaleString(),
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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>
      <div className="timer-container">
        <h1>Timer</h1>
        <div className="timer-display">{formatTime(time)}</div>

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

        <div className="report-container">
          <textarea
            placeholder="Write your report here..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="report-input"
          />
        </div>
      </div>
    </>
  );
};

export default Timer;
