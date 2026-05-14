import { useState } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

export default function Login() {
    
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // redirect based on user type
    if (data.userType === "Owner") window.location.href = "/owner/home";
    else if (data.userType === "Admin") window.location.href = "/admin/home";
    else window.location.href = "/client/home";
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>VCRTS</h1>
        <Link to="/register" className="btn-secondary">Create an Account</Link>
      </div>

      <div className="login-right">
        <h2>Sign In</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
