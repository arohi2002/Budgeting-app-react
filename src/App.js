// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BudgetingApp from './components/BudgetingApp';

import LogsPage from './components/LogsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BudgetingApp />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
