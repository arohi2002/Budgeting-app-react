// components/LogsPage.js
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

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [location.pathname]);

  useEffect(() => {
    const handleFocus = () => {
      loadLogs();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadLogs();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const allocationLogs = logs.filter(log => log.action.startsWith("Category"));
  const expenseLogs = logs.filter(log => log.action.startsWith("Spent"));

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Activity Logs</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={loadLogs}>
          🔄 Refresh Logs
        </button>
      </div>

      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        <div className="row">
          {/* Allocation Logs */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <strong>🗂 Category Allocations</strong>
              </div>
              <ul className="list-group list-group-flush">
                {allocationLogs.map((log, idx) => (
                  <li key={idx} className="list-group-item">
                    <small className="text-muted">{log.time}</small><br />
                    <span>{log.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expense Logs */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <strong>💸 Expenses / Spendings</strong>
              </div>
              <ul className="list-group list-group-flush">
                {expenseLogs.map((log, idx) => (
                  <li key={idx} className="list-group-item">
                    <small className="text-muted">{log.time}</small><br />
                    <span>{log.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>
          ← Back to Budget
        </button>
      </div>
    </div>
  );
}

export default LogsPage;
