import { useState } from "react";
import NavBar from "../components/NavBar";
import "./SubmitJob.css";

export default function SubmitJob({ user }) {
  const [form, setForm] = useState({
    clientId: user.id,
    description: "",
    duration: "",
    deadline: ""
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit() {
    if (!form.description || !form.duration || !form.deadline) {
      alert("Fields cannot be empty.");
      return;
    }

    const durationNum = Number(form.duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      alert("Duration must be a positive number.");
      return;
    }

    const deadlineDate = new Date(form.deadline);
    if (isNaN(deadlineDate)) {
      alert("Deadline must be a valid date/time.");
      return;
    }

    const res = await fetch("/api/jobs/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Job submitted for admin approval.");

    setForm({
      clientId: user.id,
      description: "",
      duration: "",
      deadline: ""
    });
  }

  return (
    <div className="submit-container">
      <NavBar user={user} />

      <div className="submit-left">
        <h1>Submit Job</h1>
      </div>

      <div className="submit-right">
        <h2>Enter Job Information</h2>

        <input
          type="text"
          placeholder="Job Description"
          value={form.description}
          onChange={e => update("description", e.target.value)}
        />

        <input
          type="number"
          placeholder="Duration (hours)"
          value={form.duration}
          onChange={e => update("duration", e.target.value)}
        />

        <input
          type="datetime-local"
          value={form.deadline}
          onChange={e => update("deadline", e.target.value)}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Submit Job
        </button>
      </div>
    </div>
  );
}
