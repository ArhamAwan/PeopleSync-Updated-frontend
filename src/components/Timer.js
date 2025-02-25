import React, { useState, useEffect } from 'react';
import './Timer.css'; // Keep the CSS file

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [report, setReport] = useState('');

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsPaused(true);
      setIsRunning(false);
    }
  };

  const resumeTimer = () => {
    if (!isRunning && isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const stopTimer = () => {
    if (report.trim() === '') {
      alert('Please submit your report to stop the timer.');
    } else {
      alert('Timer stopped and report submitted.');
      setTime(0);
      setIsRunning(false);
      setIsPaused(false);
      setReport('');
    }
  };

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>
    <div className="timer-container">
      <h1>Timer</h1>
      <div className="timer-display">{formatTime(time)}</div>

      <div className="button-group">
        <button className="start-btn" onClick={startTimer} disabled={isRunning && !isPaused}>
          Start
        </button>
        <button className="pause-btn" onClick={pauseTimer} disabled={!isRunning}>
          Pause
        </button>
        <button className="resume-btn" onClick={resumeTimer} disabled={isRunning || !isPaused}>
          Resume
        </button>
        <button className="stop-btn" onClick={stopTimer} disabled={!isRunning}>
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
