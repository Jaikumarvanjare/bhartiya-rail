import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";

export function renderHistory() {
  if (!state.history) return;
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
