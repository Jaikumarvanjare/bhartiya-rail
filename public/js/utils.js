export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

export function setStatus(online) {
  const status = $("#system-status");
  status.textContent = online ? "API online" : "API offline";
  status.classList.toggle("is-online", online);
}

export function showView(view) {
  $$(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `view-${view}`);
  });
  $$(".nav-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === view);
  });
  $("#primary-nav")?.classList.remove("is-open");
  $("#nav-toggle")?.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function availabilityClass(train) {
  if (train.availability === "Available") return "available";
  if (train.availability === "RAC") return "rac";
  return "waitlist";
}

export function stationLabel(code) {
  const station = window.__bharatStations?.find((s) => s.code === code);
  return station ? `${station.city} (${code})` : code;
}
