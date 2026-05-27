import { useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/OfferVehicle.css";

export default function OfferVehicle({ user }) {
  const [form, setForm] = useState({
    ownerId: user.id,
    vin: "",
    make: "",
    model: "",
    plate: "",
    year: "",
    arrival: "",
    departure: ""
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit() {
    // Basic validation
    if (
      !form.vin || !form.make || !form.model || !form.plate ||
      !form.year || !form.arrival || !form.departure
    ) {
      alert("Fields cannot be empty.");
      return;
    }

    if (form.vin.length !== 17) {
      alert("VIN must be 17 characters.");
      return;
    }

    if (form.year.length !== 4 || isNaN(form.year)) {
      alert("Year must be a 4‑digit number.");
      return;
    }

    const arrival = new Date(form.arrival);
    const departure = new Date(form.departure);

    if (isNaN(arrival) || isNaN(departure)) {
      alert("Arrival and departure must be valid timestamps.");
      return;
    }

    const hours = (departure - arrival) / (1000 * 60 * 60);
    if (hours < 1) {
      alert("Departure must be at least 1 hour after arrival.");
      return;
    }

    // Submit to backend
    const res = await fetch("/api/vehicles/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Vehicle submitted for admin approval.");
    setForm({
      ownerId: user.id,
      vin: "",
      make: "",
      model: "",
      plate: "",
      year: "",
      arrival: "",
      departure: ""
    });
  }

  return (
    <div className="offer-container">
      <NavBar user={user} />
      
      <h1 id = "offer-title">Offer Vehicle</h1>

      <div className="offer-form">
        <h2>Enter Vehicle Information</h2>

        <input
          type="text"
          placeholder="VIN (17 characters)"
          value={form.vin}
          onChange={e => update("vin", e.target.value)}
        />

        <input
          type="text"
          placeholder="Make"
          value={form.make}
          onChange={e => update("make", e.target.value)}
        />

        <input
          type="text"
          placeholder="Model"
          value={form.model}
          onChange={e => update("model", e.target.value)}
        />

        <input
          type="text"
          placeholder="License Plate"
          value={form.plate}
          onChange={e => update("plate", e.target.value)}
        />

        <input
          type="text"
          placeholder="Year (yyyy)"
          value={form.year}
          onChange={e => update("year", e.target.value)}
        />

        <input
          type="datetime-local"
          value={form.arrival}
          onChange={e => update("arrival", e.target.value)}
        />

        <input
          type="datetime-local"
          value={form.departure}
          onChange={e => update("departure", e.target.value)}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Submit Vehicle
        </button>
      </div>
    </div>
  );
}
