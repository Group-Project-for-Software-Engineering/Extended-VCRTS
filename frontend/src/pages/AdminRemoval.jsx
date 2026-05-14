import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import RemovalCard from "../components/RemovalCard";
import "./AdminRemoval.css";

export default function AdminRemoval({ user }) {
  const [items, setItems] = useState([]);

  async function loadItems() {
    const res = await fetch("/api/admin/removal");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="removal-container">
      <NavBar user={user} />

      <h1 className="removal-title">Admin Removal: All Vehicles and Jobs</h1>

      <div className="removal-list">
        {items.map(item => (
          <RemovalCard key={`${item.type}-${item.id}`} item={item} reload={loadItems} />
        ))}
      </div>
    </div>
  );
}
