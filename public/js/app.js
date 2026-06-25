import { state } from "../state.js";
import { $, $$, showView, showToast, setStatus } from "./utils.js";
import { api } from "./api.js";
import { renderStations, setDefaultDate, swapStations } from "./views/search.js";
import { renderResults, searchTrains, selectTrain } from "./views/results.js";
import {
  renderBooking,
  addPassenger,
  removePassenger,
  confirmBooking,
  onPassengerInput,
  onPassengerChange
} from "./views/booking.js";
import { loadLive, renderLive } from "./views/live.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderDining } from "./views/dining.js";
import { renderHistory } from "./views/history.js";
import { renderHeritage } from "./views/heritage.js";

function bindEvents() {
  $$(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.viewTarget;
      showView(view);
      if (view === "booking") renderBooking();
      if (view === "live") loadLive();
    });
  });

  $$("[data-view-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showView(link.dataset.viewLink);
    });
  });

  $("#nav-toggle")?.addEventListener("click", () => {
    const nav = $("#primary-nav");
    const open = nav.classList.toggle("is-open");
    $("#nav-toggle").setAttribute("aria-expanded", String(open));
  });

  $("#search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await searchTrains();
    } catch (error) {
      showToast(error.message);
    }
  });

  $("#swap-stations").addEventListener("click", swapStations);

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

  $("#passenger-list").addEventListener("input", onPassengerInput);
  $("#passenger-list").addEventListener("change", onPassengerChange);
  $("#passenger-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-passenger]");
    if (button) removePassenger(Number(button.dataset.removePassenger));
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
    state.selectedTrain = state.allTrains[0] ?? null;
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
    renderHeritage();
  } catch (error) {
    setStatus(false);
    showToast(error.message);
  }
}

document.addEventListener("DOMContentLoaded", init);
