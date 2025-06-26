import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function Login(props) {
  const [input, setInput] = useState({email: "", password: ""});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const {name, value} = e.target;
    setInput((prev) => ({...prev, [name]: value}));
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!input.email || !input.password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    await props.onLogin(input);
    setInput({email: "", password: ""});
    navigate("/dashboard");
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{maxWidth: "400px"}}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
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

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>

        <div className="mt-5 text-center">
            <Link to="/register">Don't have an account? Sign Up</Link>
        </div>

        <div className="mt-3 text-center">
            <Link to="/forgot-password">Forgotten password?</Link>
        </div>

        </div>
      </div>
    </div>
  );
}

export default Login;