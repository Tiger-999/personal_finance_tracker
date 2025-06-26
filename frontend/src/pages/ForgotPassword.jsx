import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function ForgotPassword(props) {
  const [input, setInput] = useState({username: "", email: ""});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInput((prev) => ({...prev, [name]: value}));
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!input.username || !input.email) {
      setError("All fields are required.");
      return;
    }

    setError("");
    await props.onForgotPassword(input);
    setInput({username: "", email: ""});
    navigate("/login");
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Forgot Password</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label"><strong>Username:</strong></label>
              <input
                type="text"
                name="username"
                value={input.username}
                onChange={handleChange}
                placeholder="Insert username ..."
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Email:</strong></label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={handleChange}
                placeholder="Insert email ..."
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-warning w-100">Send Temporary Password</button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;