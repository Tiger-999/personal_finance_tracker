import React, { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar.jsx";

function Dashboard({ user, transactions, onAddTransaction, onDeleteTransaction, onUpdateAllTransaction, onLogout }) {
  const [editingData, setEditingData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const categories = {
    income: ["Salary", "Investment", "Bonus", "Gift"],
    expense: ["Food", "Transport", "Shopping", "Rent", "Utilities"],
  };

  function formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function handleEdit(tx) {
    setEditingId(tx.id);
    setEditingData({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description || "",
      date: tx.date.slice(0, 10),
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    const updatedData = {
      ...editingData,
      amount: parseFloat(editingData.amount),
    };
    await onUpdateAllTransaction(editingId, updatedData);
    setEditingId(null);
  }

  async function handleDelete(id) {
    await onDeleteTransaction(id);
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }


  return (
    <div className="container mt-4">
    
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>
          Welcome <span className="text-primary">{user}</span>!
        </h2>
        {/* <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button> */}
      </div>

      <TransactionForm onAddTransaction={onAddTransaction} />

      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transaction yet.</p>
      ) : (
        <ul className="list-group">
          {transactions.map((tx) => (
            <li key={tx.id} className="list-group-item d-flex flex-column">
              {editingId === tx.id ? (
                <div>
                  <div className="mb-2">
                    <label>Type: </label>
                    <select name="type" value={editingData.type} onChange={handleChange} className="form-select" >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label>Category: </label>
                    <select
                      name="category"
                      value={editingData.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">-- Select Category --</option>
                      {categories[editingData.type].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label>Amount: </label>
                    <input
                      type="number"
                      name="amount"
                      value={editingData.amount}
                      onChange={handleChange}
                      placeholder="Insert amount ..."
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="mb-2">
                    <label>Description: </label>
                    <input
                      type="text"
                      name="description"
                      value={editingData.description}
                      onChange={handleChange}
                      placeholder="(Optional)"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label>Date: </label>
                    <input
                      type="date"
                      name="date"
                      value={editingData.date}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <button onClick={handleSave} className="btn btn-sm btn-success me-2">Save</button>
                  <button onClick={handleCancel} className="btn btn-sm btn-secondary">Cancel</button>

                </div>

              ) : (

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className={tx.type === "income" ? "text-success" : "text-danger"}>
                      {tx.type.toUpperCase()}
                    </strong>
                    : {tx.category} - {tx.amount} Baht on {formatDateTime(tx.date)}{" "}
                    {tx.description && `(${tx.description})`}
                  </div>

                  <div>
                    <button onClick={() => handleEdit(tx)} className="btn btn-sm btn-warning me-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
