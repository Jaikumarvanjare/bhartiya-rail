import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";

export function renderDashboard() {
  const data = state.dashboard;
  if (!data) return;

  $("#dashboard-grid").innerHTML = `
    <section class="dashboard-panel">
      <p class="eyebrow">${escapeHtml(data.profile.tier)}</p>
      <h3>Namaste, ${escapeHtml(data.profile.name)}</h3>
      <div class="stat-grid">
        <div class="stat-box"><span>Reward points</span><strong>${data.profile.points.toLocaleString("en-IN")}</strong></div>
        <div class="stat-box"><span>Journeys completed</span><strong>${data.profile.journeys}</strong></div>
        <div class="stat-box"><span>Saved passengers</span><strong>${data.profile.savedPassengers}</strong></div>
      </div>
    </section>
    <section class="dashboard-panel">
      <p class="eyebrow">Upcoming journey</p>
      <h3>${escapeHtml(data.upcoming.train)}</h3>
      <p>${escapeHtml(data.upcoming.from)} → ${escapeHtml(data.upcoming.to)}</p>
      <p>Date ${escapeHtml(data.upcoming.date)} · PNR ${escapeHtml(data.upcoming.pnr)}</p>
      <p>Coach ${escapeHtml(data.upcoming.coach)} · Seat ${escapeHtml(data.upcoming.seat)}</p>
      <span class="status-chip available">${escapeHtml(data.upcoming.status)}</span>
    </section>
    <section class="dashboard-panel">
      <p class="eyebrow">Journey intelligence</p>
      <div class="insight-list">
        ${data.insights.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </div>
    </section>
  `;
}
