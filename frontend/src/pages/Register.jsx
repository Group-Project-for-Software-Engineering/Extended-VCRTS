import { useState } from "react";
import "../styles/Register.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: ""
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleRegister() {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    //calls the registerUser function in authController.js
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Account created!");
    window.location.href = "/login";
  }

  return (
    <div className="register-container">
      <h1 id = "title">VCRTS</h1>
      <div className="register-box">
        <h2 id = "register-title">Register</h2>

        <input
          type="text"
          placeholder="Username"
          onChange={e => update("username", e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={e => update("email", e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => update("password", e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={e => update("confirmPassword", e.target.value)}
        />

        <select id = "user-type" onChange={e => update("userType", e.target.value)}>
          <option value="">Register As...</option>
          <option value="Client">Client</option>
          <option value="Owner">Owner</option>
        </select>

        <button className="btn-primary" onClick={handleRegister}>
          Create Account
        </button>

        <Link id = "login-link" to="/login" className="btn-secondary">Back to Login</Link>

      </div>

    </div>
  );
}
