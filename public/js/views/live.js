import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";
import { api } from "../api.js";

export async function loadLive(trainNumber = state.selectedTrain?.number || "22436") {
  const data = await api(`/api/live?train=${encodeURIComponent(trainNumber)}`);
  state.live = data;
  renderLive();
}

export function renderLive() {
  const live = state.live;
  if (!live) return;

  $("#live-train-label").textContent = `Train ${live.train} · ${live.status} · ${live.progress}% complete`;

  $("#live-board").innerHTML = `
    <div class="live-stat"><span>Train</span><strong>${escapeHtml(live.train)}</strong></div>
    <div class="live-stat"><span>Status</span><strong>${escapeHtml(live.status)}</strong></div>
    <div class="live-stat"><span>Last station</span><strong>${escapeHtml(live.lastStation)}</strong></div>
    <div class="live-stat"><span>Next station</span><strong>${escapeHtml(live.nextStation)}</strong></div>
    <div class="live-stat"><span>Speed</span><strong>${live.speedKmph} km/h</strong></div>
    <div class="live-stat"><span>Platform</span><strong>${escapeHtml(live.platform)}</strong></div>
    <div class="live-stat"><span>Progress</span><strong>${live.progress}%</strong></div>
  `;

  $("#live-progress-bar").style.width = `${live.progress}%`;

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
