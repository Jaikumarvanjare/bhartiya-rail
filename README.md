# Bharat Rail

Education-friendly Indian railway booking and travel-intelligence prototype. Heritage-first UI, production-style API design. **Not IRCTC. Not affiliated with Indian Railways.**

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js 22, Express 5 |
| Database | PostgreSQL 16, Prisma |
| Cache / queue | Redis 7, BullMQ |

---

## Quick start

### Prerequisites

- Node.js 22+
- Docker (for Postgres + Redis)

### Run

```bash
docker compose up -d
npm install
cp server/.env.example server/.env   # add RAILRADAR_API_KEY for live schedules
npm run db:setup
npm run dev
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:5173 |
| API | http://localhost:4000/api/v1/health |

**Demo login:** `demo@bharatrail.in` / `demo1234`

### Production build

```bash
npm run build          # client → client/dist
npm run start -w server
```

---

## Repository layout

```text
bharat-rail/
├── client/                 React SPA (Vite)
├── server/                 Express API + Prisma
│   ├── src/modules/        Domain modules (auth, catalog, bookings, …)
│   ├── prisma/             Schema, seed, station index (711 stations)
│   └── .env.example        Environment template
├── docs/                   Architecture & full API spec
├── docker-compose.yml      Postgres :5433, Redis :6380
└── package.json            npm workspaces
```

---

## Application routes (frontend)

| Path | Purpose |
|------|---------|
| `/` | Home — search, PNR, live train widget |
| `/trains/between` | Between-stations search (from, to, date, class, quota) |
| `/trains?from=&to=&date=&class=&quota=` | Results — all trains on selected date |
| `/train/:number` | Train schedule (halt-wise timetable) |
| `/train/:number/live` | Live running status & delay |
| `/train/:number/route` | Route map & halt coordinates |
| `/live` | Live train lookup by number |
| `/station` | Station hub — pick station → board or live |
| `/station/:code/board` | Station timetable |
| `/station/:code/live` | Live arrival / departure board |
| `/lookup/trains` | Train number → name directory |
| `/lookup/stations` | Station code → name directory |
| `/services` | Travel services hub |
| `/services/archive` | Legacy / compatibility datasets |
| `/booking` | Ticket booking flow |
| `/pnr` | PNR status |
| `/dashboard` | My trips |
| `/dining` | Regional meal catalog |
| `/heritage` | Cultural routes |
| `/about` | Indian Railways — heritage & milestones (educational) |

---

## API routes (backend)

Base URL: **`/api/v1`**

### System & catalog

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Liveness |
| GET | `/system/version` | App version |
| GET | `/classes` | Travel classes (SL, 3A, 2A, …) |
| GET | `/quotas` | Quota codes (GN, TQ, PT, …) |
| GET | `/stations?q=` | Search stations (711 seeded) |
| GET | `/stations/:code` | Station detail |
| GET | `/search/between/:from/:to` | **Primary search** — `?date=&class=&quota=` |
| GET | `/search/trains` | Demo seed search (fallback) |

### Train intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trains/:number/details` | Full schedule |
| GET | `/trains/:number/live` | Live status |
| GET | `/live-status/:number` | Live status (alias) |
| GET | `/trains/:number/route` | Route geometry (`?format=geojson&stops=true`) |
| GET | `/trains/between/:from/:to` | Raw between-stations proxy |

### Station intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stations/:code/trains` | Station timetable |
| GET | `/stations/:code/live` | Live board (`?hours=4`) |

### Lookup & legacy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lookup/trains` | Active train directory |
| GET | `/lookup/stations` | Station directory |
| GET | `/legacy/stations/all-kvs` | Legacy station index |
| GET | `/legacy/trains/all-kvs` | Legacy train index |
| GET | `/legacy/trains/between` | Legacy between search |
| GET | `/legacy/modules/shipping/find-trains` | Shipping route finder |
| GET | `/legacy/trains/:number` | Legacy train record |

### Booking (live prototype)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | JWT login |
| POST | `/bookings/initiate` | Start booking + seat lock |
| POST | `/bookings/:id/passengers` | Add passengers |
| POST | `/payments/create-order` | Mock payment order |
| POST | `/payments/verify` | Verify payment |
| POST | `/bookings/:id/confirm` | Confirm ticket |
| GET | `/pnr/:pnrNumber` | PNR lookup |

Full specification (120+ endpoints, planned vs live): [`docs/api.md`](./docs/api.md)

---

## Environment variables

Copy `server/.env.example` → `server/.env`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection |
| `REDIS_URL` | Yes | Seat locks, tatkal queue |
| `JWT_ACCESS_SECRET` | Yes | Access token signing |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing |
| `RAILRADAR_API_KEY` | For live data | Real schedules, live status, boards |
| `RAILRADAR_BASE_URL` | No | Schedule API base (default set in example) |
| `CLIENT_ORIGIN` | No | CORS origin (default `http://localhost:5173`) |
| `SEAT_LOCK_TTL_SECONDS` | No | Seat hold duration (default 900) |
| `TATKAL_DAILY_LIMIT` | No | Tatkal bookings per user per day |

Without `RAILRADAR_API_KEY`, between-station search falls back to demo trains where the route exists in seed data.

---

## npm scripts

| Command | Action |
|---------|--------|
| `npm run dev` | API + React dev servers |
| `npm run dev:server` | API only |
| `npm run dev:client` | UI only |
| `npm run db:setup` | Prisma push + seed |
| `npm run build` | Production client build |
| `npm run verify:railradar -w server` | Smoke-test schedule API routes |

---

## Design

Heritage UI tokens: deep indigo navigation, saffron CTAs, temple gold accents, ivory surfaces, emerald availability. Dark / light / system theme supported.

---

## Documentation

- [Architecture](./docs/architecture.md)
- [API specification](./docs/api.md)
- [History sources](./docs/history-sources.md)

---

## Disclaimer

Prototype for learning and demonstration. Not for commercial ticketing. Verify all timings and availability with official sources before travel.
