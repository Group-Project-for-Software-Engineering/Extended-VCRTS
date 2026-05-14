import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/Notifications.css";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  async function loadNotifications() {
    const res = await fetch(`/api/notifications/${user.id}`);
    const data = await res.json();
    setNotifications(data);
  }

  async function clearAll() {
    await fetch(`/api/notifications/clear/${user.id}`, {
      method: "POST"
    });
    setNotifications([]);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="notif-container">
      <NavBar user={user} />

      <h1 className="notif-title">Notifications</h1>

      <button className="notif-clear-btn" onClick={clearAll}>
        Clear All
      </button>

      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className="notif-card">
            <p>{n.message}</p>
            <span className="notif-time">{n.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
