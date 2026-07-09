import { useEffect, useState } from "react";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);

  async function loadData() {
    const v = await fetch("/dashboard/vehicles");
    const j = await fetch("/dashboard/jobs");

    setVehicles(v.data);
    setJobs(j.data);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000); // refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Distributed System Dashboard</h1>

      <h2>Vehicles</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Make</th>
            <th>Model</th>
            <th>VIN</th>
            <th>Status</th>
            <th>Last Heartbeat</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.make}</td>
              <td>{v.model}</td>
              <td>{v.vin}</td>
              <td style={{ color: v.alive ? "green" : "red" }}>
                {v.alive ? "Alive" : "Dead"}
              </td>
              <td>{v.lastHeartbeat || "Never"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>Jobs</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned Vehicle</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.description}</td>
              <td>{j.status}</td>
              <td>{j.assignedVehicleId || "None"}</td>
              <td>{j.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
