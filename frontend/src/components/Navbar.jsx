import React from "react";
import {Link, useNavigate} from "react-router-dom";

function Navbar({isLogin, user, onLogout}) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">💰 Personal Finance Tracker</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {isLogin && (
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chart">Chart</Link>
            </li>
          </ul>
        )}

        <ul className="navbar-nav ms-auto">
          {isLogin ? (
            <>
                <li className="nav-item">
                    <span className="nav-link">👤 {user}</span>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/change-password">Change Password</Link>
                </li>

                <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-sm btn-danger ms-2">Logout</button>
                </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;