import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import AdminUserCard from "../components/AdminUserCard";
import "../styles/AdminHome.css";

export default function AdminHome({ user }) {
  const [users, setUsers] = useState([]);
  const [completionTimes, setCompletionTimes] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    }
    loadUsers();
  }, []);

  async function calculateCompletionTimes() {
    const res = await fetch("/api/admin/completion-times");
    const data = await res.json();
    setCompletionTimes(data);
    alert("Completion times calculated. Scroll down to view.");
  }

  return (
    <div className="admin-home-container">
      <NavBar user={user} />

      <h1 className="admin-title">Admin View: All Users</h1>
      
      <div className="center">
        <button className="btn-primary" onClick={calculateCompletionTimes}>
          Calculate Completion Times
        </button>
      </div>

      {completionTimes && (
        <div className="completion-box">
          <h2>Completion Times</h2>
          {completionTimes.map((item, i) => (
            <p key={i}>
              <strong>Job ID:</strong> {item.jobId} — {item.completionTime}
            </p>
          ))}
        </div>
      )}

      <div className="admin-user-list">
        {users.map(u => (
          <AdminUserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
