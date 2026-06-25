import { state } from "../state.js";
import { $, escapeHtml, availabilityClass, showToast, showView } from "../utils.js";
import { api } from "../api.js";

function fareBreakdown() {
  const train = state.selectedTrain;
  const count = Math.max(1, state.passengers.length);
  const base = train ? train.fare * count : 0;
  const reservation = count * 60;
  const cultureFee = count * 25;
  const gst = Math.round((base + reservation + cultureFee) * 0.05);
  return { count, base, reservation, cultureFee, gst, total: base + reservation + cultureFee + gst };
}

function renderPassengerList() {
  $("#passenger-list").innerHTML = state.passengers
    .map(
      (p, i) => `
        <article class="passenger-card">
          <label><span>Name</span><input data-passenger="${i}" data-field="name" value="${escapeHtml(p.name)}" placeholder="Passenger name"></label>
          <label><span>Age</span><input data-passenger="${i}" data-field="age" type="number" min="1" max="120" value="${escapeHtml(p.age)}"></label>
          <label><span>Gender</span>
            <select data-passenger="${i}" data-field="gender">
              <option ${p.gender === "Male" ? "selected" : ""}>Male</option>
              <option ${p.gender === "Female" ? "selected" : ""}>Female</option>
              <option ${p.gender === "Other" ? "selected" : ""}>Other</option>
            </select>
          </label>
          <button class="icon-button" data-remove-passenger="${i}" type="button" aria-label="Remove passenger">×</button>
        </article>
      `
    )
    .join("");
}

function renderFareSummary() {
  const fare = fareBreakdown();
  $("#fare-summary").innerHTML = `
    <div class="fare-row"><span>Passengers</span><strong>${fare.count}</strong></div>
    <div class="fare-row"><span>Base fare</span><strong>₹ ${fare.base.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row"><span>Reservation</span><strong>₹ ${fare.reservation.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row"><span>Culture route fund</span><strong>₹ ${fare.cultureFee.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row"><span>GST estimate</span><strong>₹ ${fare.gst.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row total"><span>Total</span><strong>₹ ${fare.total.toLocaleString("en-IN")}</strong></div>
  `;
}

function renderSelectedTrain() {
  const train = state.selectedTrain;
  if (!train) {
    $("#selected-train").innerHTML = "";
    return;
  }
  $("#selected-train").innerHTML = `
    <div class="train-title">
      <span class="train-number">${escapeHtml(train.number)}</span>
      <h3>${escapeHtml(train.name)}</h3>
    </div>
    <p>${escapeHtml(train.fromName)} → ${escapeHtml(train.toName)} · ${escapeHtml(train.depart)} · ${escapeHtml(train.duration)}</p>
    <span class="status-chip ${availabilityClass(train)}">${escapeHtml(train.availability)}</span>
  `;
}

export function renderBooking() {
  if (!state.selectedTrain && state.allTrains.length) {
    state.selectedTrain = state.allTrains[0];
  }
  renderSelectedTrain();
  renderPassengerList();
  renderFareSummary();
}

export function addPassenger() {
  state.passengers.push({ name: "", age: 28, gender: "Male" });
  renderBooking();
}

export function removePassenger(index) {
  if (state.passengers.length === 1) {
    showToast("At least one passenger is required.");
    return;
  }
  state.passengers.splice(index, 1);
  renderBooking();
}

export async function confirmBooking() {
  if (!state.selectedTrain) {
    showToast("Select a train before booking.");
    showView("results");
    return;
  }
  if (state.passengers.some((p) => !p.name.trim())) {
    showToast("Please enter every passenger name.");
    return;
  }

  const key = crypto.randomUUID?.() ?? `BR-${Date.now()}`;
  const confirmation = await api("/api/bookings", {
    method: "POST",
    headers: { "Idempotency-Key": key },
    body: JSON.stringify({
      train: state.selectedTrain,
      passengers: state.passengers,
      paymentMethod: $("#payment-method").value,
      fare: fareBreakdown()
    })
  });

  $("#booking-confirmation").innerHTML = `
    <strong>PNR ${escapeHtml(confirmation.pnr)}</strong>
    <p>${escapeHtml(confirmation.message)}</p>
    <p>Coach ${escapeHtml(confirmation.coach)} · Berths ${confirmation.berths.map(escapeHtml).join(", ")}</p>
    <p><em>${escapeHtml(confirmation.heritageHint)}</em></p>
  `;
  $("#booking-confirmation").classList.add("is-visible");
  showToast("Booking confirmed — safe travels!");
}

export function onPassengerInput(event) {
  const field = event.target.dataset.field;
  const index = Number(event.target.dataset.passenger);
  if (!field || Number.isNaN(index)) return;
  state.passengers[index][field] = field === "age" ? Number(event.target.value) : event.target.value;
  renderFareSummary();
}

export function onPassengerChange(event) {
  const field = event.target.dataset.field;
  const index = Number(event.target.dataset.passenger);
  if (!field || Number.isNaN(index)) return;
  state.passengers[index][field] = event.target.value;
}
