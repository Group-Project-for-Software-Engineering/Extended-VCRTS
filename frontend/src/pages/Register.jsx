import { useState } from "react";
import "./Register.css";

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

    const res = await fetch("/api/users/register", {
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
      <div className="register-left">
        <h1>VCRTS</h1>
        <a href="/login" className="btn-secondary">Back to Login</a>
      </div>

      <div className="register-right">
        <h2>Register</h2>

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

        <select onChange={e => update("userType", e.target.value)}>
          <option value="">Register As...</option>
          <option value="Client">Client</option>
          <option value="Owner">Owner</option>
        </select>

        <button className="btn-primary" onClick={handleRegister}>
          Create Account
        </button>
      </div>
    </div>
  );
}
