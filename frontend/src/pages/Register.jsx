import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function Register(props) {
  const [input, setInput] = useState({username: "", email: "", password: "", rePassword: ""});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInput((prev) => ({...prev, [name]: value}));
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!input.username || !input.email || !input.password || !input.rePassword) {
      setError("All fields are required.");
      return;
    }

    if (input.password !== input.rePassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    await props.onRegister(input);
    setInput({username: "", email: "", password: "", rePassword: ""});
    navigate("/dashboard");
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Register</h3>

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

            <div className="mb-3">
              <label className="form-label"><strong>Password:</strong></label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={handleChange}
                placeholder="Insert password ..."
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Confirm Password:</strong></label>
              <input
                type="password"
                name="rePassword"
                value={input.rePassword}
                onChange={handleChange}
                placeholder="Confirm password ..."
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>

          </form>

            <div className="mt-5 text-center">
                <Link to="/login">Already have an account? Sign In</Link>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Register;