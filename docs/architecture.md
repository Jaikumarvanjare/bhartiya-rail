# Architecture

## Goal

Bharat Rail is an education-friendly Indian railway booking prototype (not IRCTC). It demonstrates search, availability, booking, PNR, live status, dining, heritage routes, and railway history with production-grade API design on the **PERN** stack.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React (Vite) | Component model, ecosystem, easy route-based screens |
| Backend | Node.js + Express | PERN alignment, simple modular monolith |
| Database | PostgreSQL | ACID bookings, relational master data |
| ORM | Prisma | Schema-first migrations, type-safe queries |
| Cache | Redis | Seat locks (TTL), search cache, rate limits |
| Queue | BullMQ | Tatkal spikes, payment webhooks, notifications |

## Design Decisions (merged from two API proposals)

1. **Modular monolith** — one deployable app with domain modules (auth, search, booking, payment…). Split into microservices only when traffic demands it.
2. **Versioned REST** — all routes under `/api/v1/*` for stable contracts.
3. **Agent 1 strengths kept** — seat-lock TTL, tatkal/premium-tatkal flows, TDR, agent B2B wallet, retiring rooms, e-catering.
4. **Agent 2 strengths kept** — system/health/audit endpoints, analytics & reports modules, loyalty/offers/insurance, clearer resource nesting.
5. **Prototype scope** — Phase 1 implements stations, trains, search, bookings, live, dining, history. Other modules are routed and documented; implement incrementally.

## Repository Layout

```text
bharat-rail/
├── client/          React UI (heritage design tokens)
├── server/          Express API + Prisma
├── docs/            architecture, API spec, content sources
├── docker-compose.yml
└── package.json     workspace scripts
```

Removed from repo: legacy Java `backend/` and static `public/` (superseded by PERN stack).

## Runtime Flow

```text
Browser (React)
  │
  │ HTTP /api/v1/*
  ▼
Express (modular monolith)
  │
  ├── PostgreSQL  (users, trains, bookings, PNR)
  ├── Redis       (seat locks, cache, rate limit)
  └── BullMQ      (tatkal queue, async jobs)
```

## Module Boundaries

Each folder under `server/src/modules/` maps to a future service:

| Module | Responsibility |
|--------|----------------|
| auth | Register, login, OTP, JWT refresh |
| users | Profile, preferences, saved routes |
| stations | Master station data, search |
| trains | Train metadata, route, schedule |
| search | Train search between stations |
| availability | Seat counts, calendar, fare |
| seats | Layout, lock/unlock (Redis TTL ~10–15 min) |
| bookings | Initiate → passengers → confirm |
| passengers | Saved traveler profiles |
| payments | Gateway order, verify, webhook, refund |
| pnr | Status, chart, history |
| tickets | PDF, QR, download |
| cancellation | Cancel, partial cancel, refund status |
| tdr | Ticket Deposit Receipt claims |
| waitlist | RAC/WL position, prediction, alerts |
| live | Running status, ETA, delay |
| meals | E-catering menu and orders |
| notifications | SMS/email/push preferences |
| agents | B2B agent wallet, bulk booking |
| admin | CMS trains, quota, fraud flags |
| reports | Revenue, occupancy, popular routes |
| system | Health, version, config |

## Booking Safety

- **Idempotency keys** on every booking and payment attempt.
- **Redis seat lock** before payment; release on timeout or cancel.
- **Server-side fare** — never trust browser totals.
- **Saga-style flow** — initiate → lock → pay → confirm → issue PNR.
- **Separate tatkal queue** with rate limiting (10/11 AM spikes).
- **Immutable audit log** for price, seat, and payment decisions.

## Scaling Path

1. CDN for static React build.
2. Cache search and train metadata in Redis.
3. Short-lived availability snapshots.
4. Strongly consistent writes for seat allocation in PostgreSQL.
5. Split hot modules (search, booking, payment) when load requires it.

See [api.md](./api.md) for the full endpoint specification.
