import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import PendingCard from "../components/PendingCard";
import "./AdminPending.css";

export default function AdminPending({ user }) {
  const [pending, setPending] = useState([]);

  async function loadPending() {
    const res = await fetch("/api/admin/pending");
    const data = await res.json();
    setPending(data);
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="pending-container">
      <NavBar user={user} />

      <h1 className="pending-title">Pending Requests</h1>

      <div className="pending-list">
        {pending.map(req => (
          <PendingCard key={req.id} req={req} reload={loadPending} />
        ))}
      </div>
    </div>
  );
}
