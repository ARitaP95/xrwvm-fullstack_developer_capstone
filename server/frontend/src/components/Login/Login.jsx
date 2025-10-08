import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);

  const login_url = "/djangoapp/api/login/"

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(login_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      const json = await res.json();
      if (json.status === "Authenticated") {
        sessionStorage.setItem('username', json.userName);
        setOpen(false);
      } else {
        alert("The user could not be authenticated.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  };

  if (!open) window.location.href = "/";

  return (
    <div>
      <Header />
      {/* Overlay do modal */}
      <div
        className="modalOverlay"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}
      >
        {/* Container do modal sem onClick no pai */}
        <div
          className="modalContainer"
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            width: "400px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
          }}
        >
          <form className="login_panel" onSubmit={login}>
            <div>
              <span className="input_field">Username</span>
              <input
                type="text"
                placeholder="Username"
                className="input_field"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div>
              <span className="input_field">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input_field"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button type="submit" className="action_button">Login</button>
              <button
                type="button"
                className="action_button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <a className="loginlink" href="/register">Register Now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
