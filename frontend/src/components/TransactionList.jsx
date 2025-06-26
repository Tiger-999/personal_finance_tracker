import React, { useState } from "react";

function TransactionList({ transactions, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const categories = {
    income: ["Salary", "Investment", "Bonus", "Gift"],
    expense: ["Food", "Transport", "Shopping", "Rent", "Utilities"],
  };

  function formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleEdit(tx) {
    setEditingId(tx.id);
    setEditData({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      description: tx.description || "",
      date: tx.date.slice(0, 10),
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    const updated = { ...editData, amount: parseFloat(editData.amount) };
    onUpdate(editingId, updated);
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }

  if (!transactions || transactions.length === 0) {
    return <p className="text-muted">No transactions yet.</p>;
  }

  return (
    <ul className="list-group mt-4">
      {transactions.map((tx) => (
        <li
          key={tx.id}
          className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start"
        >
          {editingId === tx.id ? (
            <div className="w-100">
              <div className="row mb-2">
                <div className="col-md-2">
                  <select
                    name="type"
                    value={editData.type}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- Select Category --</option>
                    {categories[editData.type].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Amount"
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="text"
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="(Optional)"
                  />
                </div>

                <div className="col-md-2">
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="text-end">
                <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div>
                <strong className={tx.type === "income" ? "text-success" : "text-danger"}>
                  {tx.type.toUpperCase()}
                </strong>{" "}
                – {tx.category} | {tx.amount} Baht
                <br />
                <small className="text-muted">{formatDateTime(tx.date)}</small>
                {tx.description && <div className="text-secondary">({tx.description})</div>}
              </div>

              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(tx)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(tx.id)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;