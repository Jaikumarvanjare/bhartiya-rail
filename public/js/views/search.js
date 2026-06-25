import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";

export function renderStations() {
  window.__bharatStations = state.stations;

  const options = state.stations
    .map(
      (s) =>
        `<option value="${escapeHtml(s.code)}">${escapeHtml(s.city)} - ${escapeHtml(s.name)} (${escapeHtml(s.code)})</option>`
    )
    .join("");

  $("#from-station").innerHTML = options;
  $("#to-station").innerHTML = options;
  $("#from-station").value = state.lastSearch.from;
  $("#to-station").value = state.lastSearch.to;

  $("#metric-stations").textContent = String(state.stations.length);

  $("#station-grid").innerHTML = state.stations
    .map(
      (s) => `
        <article class="station-card">
          <span class="station-code">${escapeHtml(s.code)}</span>
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(s.note)}</p>
          <span class="station-region">${escapeHtml(s.region)}</span>
        </article>
      `
    )
    .join("");
}

export function setDefaultDate() {
  const input = $("#journey-date");
  const date = new Date();
  date.setDate(date.getDate() + 7);
  input.value = date.toISOString().slice(0, 10);
  input.min = new Date().toISOString().slice(0, 10);
}

export function swapStations() {
  const from = $("#from-station");
  const to = $("#to-station");
  [from.value, to.value] = [to.value, from.value];
}
