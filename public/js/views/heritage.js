import { state } from "../state.js";
import { $, escapeHtml } from "../utils.js";

const HERITAGE_IMAGES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Chatrapati_Shivaji_Maharaj_terminus._Mumbai._Maharashtra.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Maharajas%27_Express.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Partial_interior_view_of_the_heritage_section_and_local_trains_ticket_booking_office_of_Chhatrapati_Shivaji_Maharaj_Terminus%2C_Mumbai%2C_Maharashtra.jpg"
];

const STATIC_ROUTES = [
  {
    tag: "Gangetic Plains",
    title: "Delhi to Kashi corridor",
    detail: "Capital avenues, temple bells, ghats, silk markets, and the sacred Ganga journey.",
    image: HERITAGE_IMAGES[0]
  },
  {
    tag: "Western Coast",
    title: "Mumbai Gothic gateways",
    detail: "CSMT heritage arches, port history, and Maratha-era city memory along the Arabian Sea.",
    image: HERITAGE_IMAGES[1]
  },
  {
    tag: "Rajasthan",
    title: "Pink city and Aravalli hills",
    detail: "Forts, block prints, palace towns, and Sufi shrines on short Rajdhani hops.",
    image: HERITAGE_IMAGES[2]
  }
];

export function renderHeritage() {
  const fromTrains = state.allTrains.map((train, i) => ({
    tag: train.type,
    title: `${train.fromName} → ${train.toName}`,
    detail: train.culture,
    image: HERITAGE_IMAGES[i % HERITAGE_IMAGES.length]
  }));

  const routes = [...STATIC_ROUTES, ...fromTrains].slice(0, 9);

  $("#heritage-grid").innerHTML = routes
    .map(
      (route) => `
        <article class="heritage-card">
          <img src="${route.image}" alt="${escapeHtml(route.title)}" loading="lazy">
          <div>
            <span class="heritage-tag">${escapeHtml(route.tag)}</span>
            <h3>${escapeHtml(route.title)}</h3>
            <p>${escapeHtml(route.detail)}</p>
          </div>
        </article>
      `
    )
    .join("");
}
