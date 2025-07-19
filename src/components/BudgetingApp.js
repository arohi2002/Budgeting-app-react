// components/BudgetingApp.js
import React, { useState } from 'react';
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

  const handleSalarySubmit = () => {
    if (salary > 0) {
      setTotalSalary(Number(salary));
      setSalary('');
      setSpendings({});
      setExpenses({});
      setLogs([]);
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
    setSpendings({
      ...spendings,
      [category]: { allocated: alloc, spent: 0 }
    });
    setLogs([...logs, { action: `Category '${category}' allocated ₹${alloc}`, time: new Date().toLocaleString() }]);
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
    setSpendings({
      ...spendings,
      [cat]: {
        ...categoryData,
        spent: categoryData.spent + spentAmount
      }
    });
    setLogs([
      ...logs,
      {
        action: `Spent ₹${spentAmount} on '${cat}'${note ? ` - ${note}` : ''}`,
        time: new Date().toLocaleString()
      }
    ]);
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