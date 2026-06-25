import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";

export function renderDining() {
  $("#dining-grid").innerHTML = state.dining
    .map(
      (meal) => `
        <article class="meal-card">
          <span class="meal-region">${escapeHtml(meal.region)}</span>
          <h3>${escapeHtml(meal.name)}</h3>
          <p>${escapeHtml(meal.note)}</p>
          <strong class="meal-price">₹ ${meal.price.toLocaleString("en-IN")}</strong>
          <span class="muted">${escapeHtml(meal.type)}</span>
        </article>
      `
    )
    .join("");
}
