import React, { useState } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0); // Timer state in seconds
  const [isRunning, setIsRunning] = useState(false); // Whether the timer is running
  const [isPaused, setIsPaused] = useState(false); // Whether the timer is paused
  const [report, setReport] = useState(''); // Report input field state

  // Start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    if (isRunning) {
      setIsPaused(true);
      setIsRunning(false);
    }
  };

  // Resume the timer
  const resumeTimer = () => {
    if (!isRunning && isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  // Stop the timer only if the report is submitted
  const stopTimer = () => {
    if (report.trim() === '') {
      alert('Please submit your report to stop the timer.');
    } else {
      alert('Timer stopped and report submitted.');
      setTime(0); // Reset the timer
      setIsRunning(false);
      setIsPaused(false);
      setReport(''); // Reset report field
    }
  };

  // Update the timer
  React.useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval); // Cleanup interval on unmount or stop
  }, [isRunning]);

  // Format time into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Timer</h1>
      <div style={{ fontSize: '2rem', marginBottom: '20px' }}>{formatTime(time)}</div>
      <button onClick={startTimer} disabled={isRunning && !isPaused}>
        Start
      </button>
      <button onClick={pauseTimer} disabled={!isRunning}>
        Pause
      </button>
      <button onClick={resumeTimer} disabled={isRunning || !isPaused}>
        Resume
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      
      {/* Report submission text field */}
      {isRunning && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            placeholder="Submit your report here..."
            value={report}
            onChange={(e) => setReport(e.target.value)}
            style={{ width: '300px', height: '100px', padding: '10px', fontSize: '14px' }}
          />
        </div>
      )}
    </div>
  );
};

export default Timer;
