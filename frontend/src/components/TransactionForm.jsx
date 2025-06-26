import React, {useState} from "react";

function TransactionForm(props) {

    const [input, setInput] = useState({type: "income", category: "", amount: "", description: "", date: ""});

    const categories = {
        income: ["Salary", "Investment", "Bonus", "Gift"],
        expense: ["Food", "Transport", "Shopping", "Rent", "Utilities"],
    };

    function handleChange(e) {
        const {name, value} = e.target;
        setInput((prev) => ({...prev, [name]: value}));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!input.category || !input.amount || !input.date) {
            alert("Please fill all required field.");
            return;
        }

        const transactionData = {...input, amount: parseFloat(input.amount)};

        props.onAddTransaction(transactionData);
        setInput({type: "income", category: "", amount: "", description: "", date: ""});
    }


return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                Add New Transaction
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label">Type</label>
                        <div className="col-sm-9">
                            <select className="form-select" name="type" value={input.type} onChange={handleChange}>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label">Category</label>
                        <div className="col-sm-9">
                            <select className="form-select" name="category" value={input.category} onChange={handleChange}>
                                <option value="">-- Select Category --</option>
                                {categories[input.type].map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label">Amount</label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                className="form-control"
                                name="amount"
                                value={input.amount}
                                onChange={handleChange}
                                placeholder="Insert amount ..."
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label">Description</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={input.description}
                                onChange={handleChange}
                                placeholder="(Optional)"
                            />
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label">Date</label>
                        <div className="col-sm-9">
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={input.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="btn btn-success">
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;