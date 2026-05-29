import { useEffect, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import JobCard from "../components/JobCard";
import NavBar from "../components/NavBar";
import "../styles/Home.css";

export default function Home({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadData() {

      // Load notifications
      const notifRes = await fetch(`/api/notifications/${user.id}`);
      const notifData = await notifRes.json();
      setNotifications(notifData);
      

      // Load vehicles or jobs depending on user type
      if (user.userType === "Owner") {
        const res = await fetch(`/api/vehicles/owner/${user.id}`)
        const data = await res.json();
        setVehicles(data);
      } else {
        const res = await fetch(`/api/jobs/client/${user.id}`)
        const data = await res.json();
        setJobs(data);
      }
    }

    loadData();
  }, [user]);

  return (
    <div className="home-container">
      <NavBar user={user} />

      <h1 className="home-title">
        {user.userType === "Owner"
          ? "Owner View: Your Vehicles"
          : "Client View: Your Jobs"}
      </h1>

      <div className="home-list">
        {user.userType === "Owner" &&
          vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}

        {user.userType !== "Owner" &&
          jobs.map(j => <JobCard key={j.id} job={j} />)}
      </div>
    </div>
  );
}
