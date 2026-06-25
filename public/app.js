const state = {
  stations: [],
  allTrains: [],
  selectedTrain: null,
  passengers: [{ name: "Aarav Sharma", age: 32, gender: "Male" }],
  dashboard: null,
  dining: [],
  history: null,
  live: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed with ${response.status}`);
  }
  return response.json();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function setStatus(online) {
  const status = $("#system-status");
  status.textContent = online ? "API online" : "API offline";
  status.classList.toggle("is-online", online);
}

function showView(view) {
  $$(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `view-${view}`);
  });
  $$(".nav-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === view);
  });
  if (view === "booking") {
    renderBooking();
  }
  if (view === "live") {
    loadLive();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setDefaultDate() {
  const input = $("#journey-date");
  const date = new Date();
  date.setDate(date.getDate() + 7);
  input.value = date.toISOString().slice(0, 10);
  input.min = new Date().toISOString().slice(0, 10);
}

function renderStations() {
  const options = state.stations
    .map(
      (station) =>
        `<option value="${escapeHtml(station.code)}">${escapeHtml(station.city)} - ${escapeHtml(
          station.name
        )} (${escapeHtml(station.code)})</option>`
    )
    .join("");

  $("#from-station").innerHTML = options;
  $("#to-station").innerHTML = options;
  $("#from-station").value = "NDLS";
  $("#to-station").value = "BSB";
}

function availabilityClass(train) {
  if (train.availability === "Available") {
    return "available";
  }
  if (train.availability === "RAC") {
    return "rac";
  }
  return "waitlist";
}

function filteredTrains() {
  const text = $("#result-query").value.trim().toLowerCase();
  const type = $("#type-filter").value;
  const onlyAvailable = $("#available-only").checked;

  return state.allTrains.filter((train) => {
    const matchesText =
      !text ||
      train.name.toLowerCase().includes(text) ||
      train.type.toLowerCase().includes(text) ||
      train.culture.toLowerCase().includes(text) ||
      train.number.includes(text);
    const matchesType = type === "all" || train.type === type;
    const matchesAvailability = !onlyAvailable || train.availability === "Available";
    return matchesText && matchesType && matchesAvailability;
  });
}

function renderResults() {
  const trains = filteredTrains();
  const container = $("#train-results");

  if (!trains.length) {
    container.innerHTML = `<div class="empty-state">No trains match these filters.</div>`;
    return;
  }

  container.innerHTML = trains
    .map(
      (train) => `
        <article class="train-card">
          <div>
            <div class="train-card-head">
              <div>
                <div class="train-title">
                  <span class="train-number">${escapeHtml(train.number)}</span>
                  <h3>${escapeHtml(train.name)}</h3>
                </div>
                <span class="status-chip ${availabilityClass(train)}">${escapeHtml(
                  train.availability
                )} ${train.seats ? `${train.seats} seats` : ""}</span>
              </div>
              <strong>${escapeHtml(train.type)}</strong>
            </div>

            <div class="train-meta">
              <div><span>From</span><strong>${escapeHtml(train.fromName)}</strong></div>
              <div><span>To</span><strong>${escapeHtml(train.toName)}</strong></div>
              <div><span>Departure</span><strong>${escapeHtml(train.depart)}</strong></div>
              <div><span>Arrival</span><strong>${escapeHtml(train.arrive)}</strong></div>
            </div>

            <p class="culture-note">${escapeHtml(train.culture)}</p>
          </div>

          <aside class="train-side">
            <div>
              <span class="muted">Duration</span>
              <strong>${escapeHtml(train.duration)}</strong>
            </div>
            <div class="fare">Rs ${train.fare.toLocaleString("en-IN")}</div>
            <button class="primary-action" data-book="${escapeHtml(train.number)}" type="button">
              Book
            </button>
            <button class="secondary-action" data-live="${escapeHtml(train.number)}" type="button">
              Track
            </button>
          </aside>
        </article>
      `
    )
    .join("");
}

async function searchTrains() {
  const params = new URLSearchParams({
    from: $("#from-station").value,
    to: $("#to-station").value,
    class: $("#travel-class").value,
    quota: $("#quota").value
  });

  const data = await api(`/api/trains?${params.toString()}`);
  state.allTrains = data.trains;
  if (!state.selectedTrain && state.allTrains.length) {
    state.selectedTrain = state.allTrains[0];
  }
  renderResults();
  showView("results");
}

function selectTrain(trainNumber) {
  const found = state.allTrains.find((train) => train.number === trainNumber);
  if (found) {
    state.selectedTrain = found;
  }
}

function fareBreakdown() {
  const train = state.selectedTrain;
  const count = Math.max(1, state.passengers.length);
  const base = train ? train.fare * count : 0;
  const reservation = count * 60;
  const cultureFee = count * 25;
  const gst = Math.round((base + reservation + cultureFee) * 0.05);
  const total = base + reservation + cultureFee + gst;
  return { count, base, reservation, cultureFee, gst, total };
}

function renderPassengerList() {
  $("#passenger-list").innerHTML = state.passengers
    .map(
      (passenger, index) => `
        <article class="passenger-card">
          <label>
            <span>Name</span>
            <input data-passenger="${index}" data-field="name" value="${escapeHtml(
              passenger.name
            )}" placeholder="Passenger name">
          </label>
          <label>
            <span>Age</span>
            <input data-passenger="${index}" data-field="age" type="number" min="1" max="120" value="${escapeHtml(
              passenger.age
            )}">
          </label>
          <label>
            <span>Gender</span>
            <select data-passenger="${index}" data-field="gender">
              <option ${passenger.gender === "Male" ? "selected" : ""}>Male</option>
              <option ${passenger.gender === "Female" ? "selected" : ""}>Female</option>
              <option ${passenger.gender === "Other" ? "selected" : ""}>Other</option>
            </select>
          </label>
          <button class="icon-button" data-remove-passenger="${index}" type="button" aria-label="Remove passenger">
            X
          </button>
        </article>
      `
    )
    .join("");
}

function renderFareSummary() {
  const fare = fareBreakdown();
  $("#fare-summary").innerHTML = `
    <div class="fare-row"><span>Passengers</span><strong>${fare.count}</strong></div>
    <div class="fare-row"><span>Base fare</span><strong>Rs ${fare.base.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row"><span>Reservation</span><strong>Rs ${fare.reservation.toLocaleString(
      "en-IN"
    )}</strong></div>
    <div class="fare-row"><span>Culture route fund</span><strong>Rs ${fare.cultureFee.toLocaleString(
      "en-IN"
    )}</strong></div>
    <div class="fare-row"><span>GST estimate</span><strong>Rs ${fare.gst.toLocaleString("en-IN")}</strong></div>
    <div class="fare-row total"><span>Total</span><strong>Rs ${fare.total.toLocaleString(
      "en-IN"
    )}</strong></div>
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
    <p>${escapeHtml(train.fromName)} to ${escapeHtml(train.toName)} - ${escapeHtml(
    train.depart
  )} departure - ${escapeHtml(train.duration)}</p>
    <span class="status-chip ${availabilityClass(train)}">${escapeHtml(train.availability)}</span>
  `;
}

function renderBooking() {
  if (!state.selectedTrain && state.allTrains.length) {
    state.selectedTrain = state.allTrains[0];
  }
  renderSelectedTrain();
  renderPassengerList();
  renderFareSummary();
}

function addPassenger() {
  state.passengers.push({ name: "", age: 28, gender: "Male" });
  renderBooking();
}

function removePassenger(index) {
  if (state.passengers.length === 1) {
    showToast("At least one passenger is required.");
    return;
  }
  state.passengers.splice(index, 1);
  renderBooking();
}

async function confirmBooking() {
  if (!state.selectedTrain) {
    showToast("Select a train before booking.");
    showView("results");
    return;
  }

  const invalid = state.passengers.some((passenger) => !passenger.name.trim());
  if (invalid) {
    showToast("Please enter every passenger name.");
    return;
  }

  const webCrypto = window.crypto || {};
  const idempotencyKey = webCrypto.randomUUID
    ? webCrypto.randomUUID()
    : `BR-${Date.now()}-${Math.random()}`;

  const payload = {
    train: state.selectedTrain,
    passengers: state.passengers,
    paymentMethod: $("#payment-method").value,
    fare: fareBreakdown()
  };

  const confirmation = await api("/api/bookings", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload)
  });

  $("#booking-confirmation").innerHTML = `
    <strong>PNR ${escapeHtml(confirmation.pnr)}</strong>
    <p>${escapeHtml(confirmation.message)}</p>
    <p>Coach ${escapeHtml(confirmation.coach)} - Seats ${confirmation.berths
    .map(escapeHtml)
    .join(", ")}</p>
  `;
  $("#booking-confirmation").classList.add("is-visible");
  showToast("Booking confirmed.");
}

async function loadLive(trainNumber = state.selectedTrain?.number || "22436") {
  const data = await api(`/api/live?train=${encodeURIComponent(trainNumber)}`);
  state.live = data;
  renderLive();
}

function renderLive() {
  const live = state.live;
  if (!live) {
    return;
  }

  $("#live-board").innerHTML = `
    <div class="live-stat"><span>Train</span><strong>${escapeHtml(live.train)}</strong></div>
    <div class="live-stat"><span>Status</span><strong>${escapeHtml(live.status)}</strong></div>
    <div class="live-stat"><span>Last station</span><strong>${escapeHtml(live.lastStation)}</strong></div>
    <div class="live-stat"><span>Next station</span><strong>${escapeHtml(live.nextStation)}</strong></div>
    <div class="live-stat"><span>Speed</span><strong>${live.speedKmph} km/h</strong></div>
    <div class="live-stat"><span>Platform</span><strong>${escapeHtml(live.platform)}</strong></div>
    <div class="live-stat"><span>Progress</span><strong>${live.progress}%</strong></div>
  `;

  $("#track-line").innerHTML = live.stops
    .map(
      (stop) => `
        <article class="track-stop ${escapeHtml(stop.state)}">
          <span class="track-dot"></span>
          <strong>${escapeHtml(stop.name)}</strong>
          <span>${escapeHtml(stop.time)}</span>
        </article>
      `
    )
    .join("");
}

function renderDashboard() {
  const data = state.dashboard;
  if (!data) {
    return;
  }

  $("#dashboard-grid").innerHTML = `
    <section class="dashboard-panel">
      <p class="eyebrow">${escapeHtml(data.profile.tier)}</p>
      <h3>Namaste, ${escapeHtml(data.profile.name)}</h3>
      <div class="stat-grid">
        <div class="stat-box"><span>Reward points</span><strong>${data.profile.points.toLocaleString(
          "en-IN"
        )}</strong></div>
        <div class="stat-box"><span>Journeys</span><strong>${data.profile.journeys}</strong></div>
        <div class="stat-box"><span>Saved passengers</span><strong>${data.profile.savedPassengers}</strong></div>
      </div>
    </section>
    <section class="dashboard-panel">
      <p class="eyebrow">Upcoming journey</p>
      <h3>${escapeHtml(data.upcoming.train)}</h3>
      <p>${escapeHtml(data.upcoming.from)} to ${escapeHtml(data.upcoming.to)}</p>
      <p>PNR ${escapeHtml(data.upcoming.pnr)} - Coach ${escapeHtml(data.upcoming.coach)} - Seat ${escapeHtml(
    data.upcoming.seat
  )}</p>
      <span class="status-chip available">${escapeHtml(data.upcoming.status)}</span>
    </section>
    <section class="dashboard-panel">
      <p class="eyebrow">Journey intelligence</p>
      ${data.insights.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
    </section>
  `;
}

function renderDining() {
  $("#dining-grid").innerHTML = state.dining
    .map(
      (meal) => `
        <article class="meal-card">
          <span class="meal-region">${escapeHtml(meal.region)}</span>
          <h3>${escapeHtml(meal.name)}</h3>
          <p>${escapeHtml(meal.note)}</p>
          <strong class="meal-price">Rs ${meal.price.toLocaleString("en-IN")}</strong>
          <span class="muted">${escapeHtml(meal.type)}</span>
        </article>
      `
    )
    .join("");
}

function renderHistory() {
  if (!state.history) {
    return;
  }
  $("#history-summary").textContent = state.history.summary;
  $("#history-timeline").innerHTML = state.history.timeline
    .map(
      (item) => `
        <article class="timeline-item">
          <strong class="timeline-year">${escapeHtml(item.year)}</strong>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.detail)}</p>
          </div>
          <span class="timeline-region">${escapeHtml(item.region)}</span>
        </article>
      `
    )
    .join("");
}

function bindEvents() {
  $$(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });

  $("#search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await searchTrains();
    } catch (error) {
      showToast(error.message);
    }
  });

  ["#result-query", "#type-filter", "#available-only"].forEach((selector) => {
    $(selector).addEventListener("input", renderResults);
    $(selector).addEventListener("change", renderResults);
  });

  $("#train-results").addEventListener("click", async (event) => {
    const book = event.target.closest("[data-book]");
    const live = event.target.closest("[data-live]");
    if (book) {
      selectTrain(book.dataset.book);
      renderBooking();
      showView("booking");
    }
    if (live) {
      selectTrain(live.dataset.live);
      await loadLive(live.dataset.live);
      showView("live");
    }
  });

  $("#add-passenger").addEventListener("click", addPassenger);
  $("#confirm-booking").addEventListener("click", async () => {
    try {
      await confirmBooking();
    } catch (error) {
      showToast(error.message);
    }
  });

  $("#passenger-list").addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    const index = Number(event.target.dataset.passenger);
    if (!field || Number.isNaN(index)) {
      return;
    }
    state.passengers[index][field] = field === "age" ? Number(event.target.value) : event.target.value;
    renderFareSummary();
  });

  $("#passenger-list").addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    const index = Number(event.target.dataset.passenger);
    if (!field || Number.isNaN(index)) {
      return;
    }
    state.passengers[index][field] = event.target.value;
  });

  $("#passenger-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-passenger]");
    if (button) {
      removePassenger(Number(button.dataset.removePassenger));
    }
  });
}

async function init() {
  bindEvents();
  setDefaultDate();

  try {
    const [health, stationData, trainData, dashboardData, diningData, historyData, liveData] =
      await Promise.all([
        api("/health"),
        api("/api/stations"),
        api("/api/trains"),
        api("/api/dashboard"),
        api("/api/dining"),
        api("/api/history"),
        api("/api/live?train=22436")
      ]);

    setStatus(health.status === "ok");
    state.stations = stationData.stations;
    state.allTrains = trainData.trains;
    state.selectedTrain = state.allTrains[0];
    state.dashboard = dashboardData;
    state.dining = diningData.meals;
    state.history = historyData;
    state.live = liveData;

    renderStations();
    renderResults();
    renderBooking();
    renderLive();
    renderDashboard();
    renderDining();
    renderHistory();
  } catch (error) {
    setStatus(false);
    showToast(error.message);
  }
}

document.addEventListener("DOMContentLoaded", init);
