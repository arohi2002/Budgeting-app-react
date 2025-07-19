import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('logs')) || [];
    setLogs(storedLogs);
  }, []);

  return (
    <div className="container mt-4">
      <h3>Activity Logs</h3>
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
