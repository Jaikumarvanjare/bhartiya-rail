import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../api/client.js";
import BookingStepper from "../components/BookingStepper.jsx";

function defaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export default function BookingPage() {
  const { selectedTrain, passengers, setPassengers, bookingResult, setBookingResult, lastSearch } = useApp();
  const [journeyDate] = useState(defaultDate());
  const [step, setStep] = useState("passengers");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updatePassenger(index, field, value) {
    setPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function addPassenger() {
    setPassengers((prev) => [...prev, { name: "", age: 30, gender: "Male" }]);
  }

  function removePassenger(index) {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  }

  async function runSaga() {
    setLoading(true);
    setError("");
    try {
      const initiate = await api("/bookings/initiate", {
        method: "POST",
        body: JSON.stringify({
          trainNumber: selectedTrain.number,
          journeyDate,
          travelClass: lastSearch.class,
          quota: lastSearch.quota,
          passengerCount: passengers.length
        })
      });
      setStep("locked");

      await api(`/bookings/${initiate.sessionId}/passengers`, {
        method: "POST",
        body: JSON.stringify({ passengers })
      });
      setStep("passengers");

      const order = await api("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ sessionId: initiate.sessionId })
      });
      setStep("payment");

      await api("/payments/verify", {
        method: "POST",
        body: JSON.stringify({ orderId: order.orderId, paymentRef: "MOCK-UPI" })
      });

      const confirmed = await api(`/bookings/${initiate.sessionId}/confirm`, {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Idempotency-Key": crypto.randomUUID() }
      });

      setBookingResult(confirmed);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!selectedTrain) {
    return (
      <div className="empty-state">
        <h2 className="display">Pick a train first</h2>
        <p className="muted">Search and select a service to begin secure booking.</p>
        <Link to="/trains" className="primary-action" style={{ display: "inline-block", marginTop: 12 }}>View trains</Link>
      </div>
    );
  }

  const baseFare = selectedTrain.fare * passengers.length;
  const gst = Math.round(baseFare * 0.05);
  const total = baseFare + gst;

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">Secure booking</p>
        <h1 className="display">{selectedTrain.name}</h1>
        <p className="muted">{selectedTrain.number} · {journeyDate} · {lastSearch.class} / {lastSearch.quota}</p>
      </header>

      <BookingStepper current={step} />

      <div className="booking-grid">
        <div className="card">
          <h2>Passenger details</h2>
          {passengers.map((p, index) => (
            <div key={index} className="passenger-row">
              <input placeholder="Full name" value={p.name} onChange={(e) => updatePassenger(index, "name", e.target.value)} aria-label={`Passenger ${index + 1} name`} />
              <input type="number" min="1" max="120" value={p.age} onChange={(e) => updatePassenger(index, "age", Number(e.target.value))} aria-label={`Passenger ${index + 1} age`} />
              <select value={p.gender} onChange={(e) => updatePassenger(index, "gender", e.target.value)} aria-label={`Passenger ${index + 1} gender`}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <button type="button" className="ghost-action" onClick={() => removePassenger(index)} disabled={passengers.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" className="secondary-action" onClick={addPassenger}>Add passenger</button>
        </div>

        <aside className="card fare-card ticket-card">
          <h2>Fare summary</h2>
          <p>Base fare · ₹{baseFare.toLocaleString("en-IN")}</p>
          <p>GST & charges · ₹{gst.toLocaleString("en-IN")}</p>
          <p className="fare">Total · ₹{total.toLocaleString("en-IN")}</p>
          <p className="muted">Seats locked in Redis for ~15 min during checkout.</p>
          <button className="primary-action full-width" type="button" onClick={runSaga} disabled={loading}>
            {loading ? "Processing…" : "Pay & confirm PNR"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </aside>
      </div>

      {bookingResult?.pnr && (
        <div className="card success-card">
          <p className="eyebrow">Confirmed</p>
          <h2 className="display">PNR {bookingResult.pnr}</h2>
          <p>{bookingResult.message}</p>
          <p>Coach {bookingResult.coach} · Berths {bookingResult.berths.join(", ")}</p>
          <p className="muted">{bookingResult.heritageHint}</p>
        </div>
      )}
    </section>
  );
}
