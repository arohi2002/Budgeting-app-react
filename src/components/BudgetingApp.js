// components/BudgetingApp.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BudgetingApp() {
  const [salary, setSalary] = useState('');
  const [totalSalary, setTotalSalary] = useState(0);
  const [category, setCategory] = useState('');
  const [allocation, setAllocation] = useState('');
  const [spendings, setSpendings] = useState({});
  const [expenses, setExpenses] = useState({});
  const [notes, setNotes] = useState({});
  const [logs, setLogs] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSalary = localStorage.getItem('totalSalary');
    const savedSpendings = localStorage.getItem('spendings');
    const savedLogs = localStorage.getItem('logs');
    
    if (savedSalary) setTotalSalary(Number(savedSalary));
    if (savedSpendings) setSpendings(JSON.parse(savedSpendings));
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      setLogs(parsedLogs);
    }
    
    // Mark initial load as complete
    setIsInitialLoad(false);
  }, []);

  // Save logs to localStorage whenever logs change (but not during initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  }, [logs, isInitialLoad]);

  const handleSalarySubmit = () => {
    if (salary > 0) {
      const newSalary = Number(salary);
      setTotalSalary(newSalary);
      localStorage.setItem('totalSalary', newSalary.toString());
      setSalary('');
      setSpendings({});
      setExpenses({});
      // Don't clear logs when setting salary - keep existing logs
      localStorage.removeItem('spendings');
    }
  };

  const handleAddCategory = () => {
    const alloc = Number(allocation);
    if (!category || alloc <= 0) {
      alert('Enter valid category and amount');
      return;
    }
    const currentTotalAlloc = Object.values(spendings).reduce((sum, val) => sum + val.allocated, 0);
    if (currentTotalAlloc + alloc > totalSalary) {
      alert("Allocating this will exceed your salary!");
      return;
    }
    const newSpendings = {
      ...spendings,
      [category]: { allocated: alloc, spent: 0 }
    };
    setSpendings(newSpendings);
    localStorage.setItem('spendings', JSON.stringify(newSpendings));
    
    const newLogs = [...logs, { action: `Category '${category}' allocated ₹${alloc}`, time: new Date().toLocaleString() }];
    setLogs(newLogs);
    
    setCategory('');
    setAllocation('');
  };

  const handleSpendInCategory = (cat) => {
    const spentAmount = Number(expenses[cat] || 0);
    const note = notes[cat] || '';
    if (spentAmount <= 0) {
      alert('Enter a valid amount');
      return;
    }
    const categoryData = spendings[cat];
    if (categoryData.spent + spentAmount > categoryData.allocated) {
      alert("You are exceeding the allocation for this category!");
      return;
    }
    const newSpendings = {
      ...spendings,
      [cat]: {
        ...categoryData,
        spent: categoryData.spent + spentAmount
      }
    };
    setSpendings(newSpendings);
    localStorage.setItem('spendings', JSON.stringify(newSpendings));
    
    const newLogs = [
      ...logs,
      {
        action: `Spent ₹${spentAmount} on '${cat}'${note ? ` - ${note}` : ''}`,
        time: new Date().toLocaleString()
      }
    ];
    setLogs(newLogs);
    
    setExpenses({ ...expenses, [cat]: '' });
    setNotes({ ...notes, [cat]: '' });
  };

  const totalAllocated = Object.values(spendings).reduce((sum, val) => sum + val.allocated, 0);
  const totalSpent = Object.values(spendings).reduce((sum, val) => sum + val.spent, 0);
  const totalRemaining = totalSalary - totalSpent;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="text-primary">My Budget App</h1>
        <Link to="/logs" className="btn btn-outline-secondary">View Logs</Link>
      </div>

      {/* Salary Input */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Enter Monthly Salary</h5>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Enter salary"
          />
          <button className="btn btn-success" onClick={handleSalarySubmit}>
            Submit
          </button>
        </div>
        <div className="alert alert-info">
          <strong>Salary:</strong> ₹{totalSalary} &nbsp; | &nbsp;
          <strong>Allocated:</strong> ₹{totalAllocated} &nbsp; | &nbsp;
          <strong>Spent:</strong> ₹{totalSpent} &nbsp; | &nbsp;
          <strong>Remaining:</strong> ₹{totalRemaining}
        </div>
      </div>

      {/* Category Allocation */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Allocate Budget to Categories</h5>
        <input
          type="text"
          className="form-control mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g. Food, Travel)"
        />
        <input
          type="number"
          className="form-control mb-2"
          value={allocation}
          onChange={(e) => setAllocation(e.target.value)}
          placeholder="Allocation Amount"
        />
        <button className="btn btn-primary w-100" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      {/* Category-wise Spending */}
      {Object.keys(spendings).length > 0 && (
        <div className="card p-4 shadow-sm">
          <h5>Track Expenses</h5>
          <ul className="list-group">
            {Object.entries(spendings).map(([cat, data]) => (
              <li key={cat} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{cat}</strong>
                  <span>
                    Allocated: ₹{data.allocated} | Spent: ₹{data.spent} | Remaining: ₹{data.allocated - data.spent}
                  </span>
                </div>
                <div className="input-group mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Add expense"
                    value={expenses[cat] || ''}
                    onChange={(e) => setExpenses({ ...expenses, [cat]: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Note (e.g. Grocery)"
                    value={notes[cat] || ''}
                    onChange={(e) => setNotes({ ...notes, [cat]: e.target.value })}
                  />
                  <button className="btn btn-outline-success" onClick={() => handleSpendInCategory(cat)}>
                    Spend
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BudgetingApp;