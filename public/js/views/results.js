import { state } from "../state.js";
import { $, escapeHtml, availabilityClass, stationLabel, showView } from "../utils.js";
import { api } from "../api.js";

export function filteredTrains() {
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

export function renderResults() {
  const trains = filteredTrains();
  const container = $("#train-results");
  $("#metric-trains").textContent = String(state.allTrains.length);

  const from = state.lastSearch.from;
  const to = state.lastSearch.to;
  $("#results-route-summary").textContent =
    from && to
      ? `${stationLabel(from)} → ${stationLabel(to)} · ${trains.length} service(s) found`
      : `${trains.length} train(s) available`;

  if (!trains.length) {
    container.innerHTML = `<div class="empty-state">No trains match these filters. Try another corridor or class.</div>`;
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
                <span class="status-chip ${availabilityClass(train)}">${escapeHtml(train.availability)}${train.seats ? ` · ${train.seats} seats` : ""}</span>
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
            <div><span class="muted">Duration</span><strong>${escapeHtml(train.duration)}</strong></div>
            <div class="fare">₹ ${train.fare.toLocaleString("en-IN")}</div>
            <button class="primary-action" data-book="${escapeHtml(train.number)}" type="button">Book journey</button>
            <button class="secondary-action" data-live="${escapeHtml(train.number)}" type="button">Track live</button>
          </aside>
        </article>
      `
    )
    .join("");
}

export async function searchTrains() {
  state.lastSearch = {
    from: $("#from-station").value,
    to: $("#to-station").value
  };

  const params = new URLSearchParams({
    from: state.lastSearch.from,
    to: state.lastSearch.to,
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

export function selectTrain(trainNumber) {
  const found = state.allTrains.find((t) => t.number === trainNumber);
  if (found) state.selectedTrain = found;
}
