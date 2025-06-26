import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

function ChangePassword(props) {
  const [input, setInput] = useState({email: "", currentPassword: "", newPassword: "", reNewPassword: ""});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
        setInput((prev) => ({...prev, email: email}));
    }
  }, []);

  function handleChange(e) {
    const {name, value} = e.target;
    setInput((prev) => ({...prev, [name]: value}));
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!input.email || !input.currentPassword || !input.newPassword || !input.reNewPassword) {
      setError("All fields are required.");
      return;
    }

    setError("");
    await props.onChangePassword(input);
    setInput({email: "", currentPassword: "", newPassword: "", reNewPassword: ""});
    navigate("/login");
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{maxWidth: "400px"}}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Change Password</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label"><strong>Email:</strong></label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={handleChange}
                placeholder="Insert email ..."
                className="form-control"
                readOnly
                style={{backgroundColor: "gray"}}
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Current Password:</strong></label>
              <input
                type="password"
                name="currentPassword"
                value={input.currentPassword}
                onChange={handleChange}
                placeholder="Insert current password ..."
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>New Password:</strong></label>
              <input
                type="password"
                name="newPassword"
                value={input.newPassword}
                onChange={handleChange}
                placeholder="Insert new password ..."
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Confirm New Password:</strong></label>
              <input
                type="password"
                name="reNewPassword"
                value={input.reNewPassword}
                onChange={handleChange}
                placeholder="Re-insert new password ..."
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-warning w-100">Change Password</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ChangePassword;