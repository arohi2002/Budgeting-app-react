import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LogsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    const rawLogs = localStorage.getItem('logs');
    
    let storedLogs = [];
    try {
      if (rawLogs) {
        storedLogs = JSON.parse(rawLogs);
      }
    } catch (error) {
      storedLogs = [];
    }
    
    setLogs(storedLogs);
  };

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Load logs when location changes (navigation)
  useEffect(() => {
    loadLogs();
  }, [location.pathname]);

  // Load logs when window gains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      loadLogs();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Load logs when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadLogs();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Activity Logs</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={loadLogs}>
          Refresh Logs
        </button>
      </div>
      
      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {logs.map((log, idx) => (
            <li key={idx} className="list-group-item">
              <strong>{log.time}</strong> — {log.action}
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Back to Budget</button>
    </div>
  );
}

export default LogsPage;
