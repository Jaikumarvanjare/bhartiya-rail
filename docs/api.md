# API Specification

Base URL: `/api/v1`  
Auth: `Authorization: Bearer <access_token>` where marked **auth**.

Status: **live** = implemented in prototype · **planned** = routed stub, build next.

---

## System

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/health` | live | Liveness check |
| GET | `/system/version` | live | App version |
| GET | `/system/status` | planned | Dependency status (DB, Redis) |
| GET | `/system/server-time` | planned | Server clock for tatkal windows |

---

## Auth

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | planned | Create account |
| POST | `/auth/login` | planned | Email/mobile + password |
| POST | `/auth/logout` | planned | Invalidate refresh token |
| POST | `/auth/refresh-token` | planned | Rotate access token |
| POST | `/auth/send-otp` | planned | Send OTP |
| POST | `/auth/verify-otp` | planned | Verify OTP |
| POST | `/auth/forgot-password` | planned | Reset link/OTP |
| POST | `/auth/reset-password` | planned | Set new password |
| POST | `/auth/change-password` | planned | **auth** Change password |

---

## Users

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/users/me` | planned | **auth** Current profile |
| PATCH | `/users/me` | planned | **auth** Update profile |
| DELETE | `/users/me` | planned | **auth** Delete account |
| GET | `/users/me/wallet` | planned | **auth** IRCTC-style eWallet balance |
| GET | `/users/preferences` | planned | **auth** Notification & travel prefs |
| PATCH | `/users/preferences` | planned | **auth** Update prefs |
| GET | `/users/saved-routes` | planned | **auth** Saved from/to pairs |
| POST | `/users/saved-routes` | planned | **auth** Save route |
| DELETE | `/users/saved-routes/:id` | planned | **auth** Remove route |

---

## Master Data

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/stations` | live | List/search stations (`?q=`) |
| GET | `/stations/:code` | live | Station detail |
| GET | `/stations/popular` | planned | Popular hubs |
| GET | `/trains` | live | List trains (`?from=&to=&class=&q=`) |
| GET | `/trains/:trainNumber` | live | Train detail |
| GET | `/trains/:trainNumber/schedule` | planned | Running days (use `/trains/:number/details` for RailRadar schedule) |
| GET | `/classes` | live | SL, 3A, 2A, 1A, CC, EC… |
| GET | `/quotas` | live | GN, TQ, PT, LD, SS, HP |
| GET | `/coach-types` | planned | Coach layout types |
| GET | `/berth-types` | planned | LB, MB, UB, SL, SU |
| GET | `/payment-methods` | planned | UPI, card, netbanking, wallet |

---

## Search & Availability

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/search/between/:from/:to` | live | Primary between-stations search (`?date=&class=&quota=`) |
| GET | `/search/trains` | live | Demo seed search (fallback) |
| GET | `/availability/:trainNumber` | planned | Single train availability |
| GET | `/availability/calendar` | planned | 7–10 day flexible view |
| GET | `/fare/:trainNumber` | planned | Fare breakup, GST, concession |
| GET | `/seats/layout/:trainNumber/:coach` | planned | Coach berth map |
| POST | `/seats/lock` | planned | **auth** Lock berths (Redis TTL) |
| DELETE | `/seats/lock/:lockId` | planned | **auth** Release lock |

---

## Bookings

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/bookings/initiate` | planned | **auth** Start session + lock |
| POST | `/bookings/:id/passengers` | planned | **auth** Add passengers |
| POST | `/bookings/:id/confirm` | planned | **auth** Finalize after payment |
| POST | `/bookings` | live | **auth** Prototype one-shot book |
| GET | `/bookings` | planned | **auth** User history |
| GET | `/bookings/:id` | planned | **auth** Booking detail |
| DELETE | `/bookings/:id/cancel-session` | planned | **auth** Abandon before pay |
| POST | `/bookings/tatkal/initiate` | planned | **auth** Tatkal flow |
| POST | `/bookings/premium-tatkal/initiate` | planned | **auth** Premium tatkal |

---

## Passengers (saved profiles)

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/passengers` | planned | **auth** Frequent travelers |
| POST | `/passengers` | planned | **auth** Save traveler |
| PATCH | `/passengers/:id` | planned | **auth** Update |
| DELETE | `/passengers/:id` | planned | **auth** Remove |

---

## Payments

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/payments/create-order` | planned | **auth** Gateway order |
| POST | `/payments/verify` | planned | **auth** Client verify |
| POST | `/payments/webhook` | planned | Gateway callback |
| GET | `/payments/:id/status` | planned | **auth** Payment status |
| POST | `/payments/refund` | planned | **auth** Refund request |
| GET | `/payments/history` | planned | **auth** Past payments |

---

## PNR & Tickets

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/pnr/:pnrNumber` | planned | PNR lookup |
| GET | `/pnr/:pnrNumber/status` | planned | WL/RAC/confirmed |
| GET | `/pnr/:pnrNumber/chart` | planned | Final chart |
| GET | `/tickets/:id/download` | planned | **auth** PDF e-ticket |
| GET | `/tickets/:id/qr` | planned | **auth** QR payload |

---

## Cancellation & TDR

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/cancellation/:pnrNumber` | planned | **auth** Full cancel |
| POST | `/cancellation/partial` | planned | **auth** Cancel selected passengers |
| GET | `/cancellation/:pnrNumber/refund-status` | planned | **auth** Refund progress |
| POST | `/tdr/file` | planned | **auth** File TDR claim |
| GET | `/tdr/:id/status` | planned | **auth** TDR status |

---

## Waitlist

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/waitlist/:pnrNumber/prediction` | planned | Confirmation probability |
| GET | `/waitlist/:trainNumber/position` | planned | Current WL position |
| POST | `/waitlist/notify-on-confirm` | planned | **auth** Alert subscription |

---

## Live Train

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/live-status/:trainNumber` | live | Live tracking via RailRadar (`?date=`, `?haltsOnly=true`) |
| GET | `/live-status/:trainNumber/eta/:stationCode` | planned | ETA at station |
| GET | `/trains/:trainNumber/delay-history` | planned | Delay trends |

---

## RailRadar proxy

All endpoints proxy the configured schedule provider. Requires `RAILRADAR_API_KEY` in `server/.env`. Responses: `{ source, data, meta }` unless noted.

### Trains

| Method | Endpoint | Upstream | Description |
|--------|----------|----------|-------------|
| GET | `/trains/:trainNumber/details` | `/v1/trains/{number}` | Full schedule + meta (mapped for UI) |
| GET | `/trains/:trainNumber/live` | `/v1/trains/{number}/live` | Live status (mapped for UI) |
| GET | `/live-status/:trainNumber` | `/v1/trains/{number}/live` | Live status UI alias |
| GET | `/trains/:trainNumber/route` | `/v1/trains/{number}/route` | Route geometry (`?format=geojson\|polyline\|coordinates`, `?stops=true`) |
| GET | `/trains/between/:from/:to` | `/v1/trains/between/{from}/{to}` | Trains between stations (`?date=`, `?live=`, `?type=`, `?category=`) |

### Stations

| Method | Endpoint | Upstream | Description |
|--------|----------|----------|-------------|
| GET | `/stations/:code/trains` | `/v1/stations/{code}/trains` | Static station board (`?includeIntermediate=`) |
| GET | `/stations/:code/live` | `/v1/stations/{code}/live` | Live arrival/departure board (`?hours=2\|4\|6\|8`) |

### Lookup

| Method | Endpoint | Upstream | Description |
|--------|----------|----------|-------------|
| GET | `/lookup/trains` | `/v1/lookup/trains` | All active train number → name map |
| GET | `/lookup/stations` | `/v1/lookup/stations` | All station code → name map |

### Legacy

| Method | Endpoint | Upstream | Description |
|--------|----------|----------|-------------|
| GET | `/legacy/stations/all-kvs` | `/v1/legacy/stations/all-kvs` | Stations KV array |
| GET | `/legacy/trains/all-kvs` | `/v1/legacy/trains/all-kvs` | Trains KV array |
| GET | `/legacy/trains/between` | `/v1/legacy/trains/between` | `?from=&to=` legacy between search |
| GET | `/legacy/modules/shipping/find-trains` | `/v1/legacy/modules/shipping/find-trains` | `?source=&lat=&lng=` shipping search |
| GET | `/legacy/trains/:trainNumber` | `/v1/legacy/trains/{number}` | Legacy train data (`?journeyDate=`, `?dataType=`) |
| GET | `/integrations/railradar` | — | Route inventory + config status |

---

## Meals (e-catering)

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/meals` | live | Menu (`?stationCode=`) |
| POST | `/meals/order` | planned | **auth** Place order |
| GET | `/meals/orders/:id` | planned | **auth** Order status |

---

## Retiring Rooms & Lounges

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/retiring-rooms` | planned | `?stationCode=` |
| POST | `/retiring-rooms/book` | planned | **auth** Book room |
| GET | `/lounges` | planned | `?stationCode=` |

---

## Notifications

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/notifications` | planned | **auth** Inbox |
| PATCH | `/notifications/read` | planned | **auth** Mark read |
| POST | `/notifications/subscribe` | planned | **auth** SMS/email/push |
| GET | `/notifications/preferences` | planned | **auth** Prefs |
| PUT | `/notifications/preferences` | planned | **auth** Update prefs |

---

## Agents (B2B)

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/agents/register` | planned | Agent onboarding + KYC |
| GET | `/agents/profile` | planned | **auth** Agent profile |
| POST | `/agents/bookings` | planned | **auth** Book for customer |
| GET | `/agents/commissions` | planned | **auth** Commission report |
| GET | `/agents/wallet` | planned | **auth** Balance |
| POST | `/agents/wallet/recharge` | planned | **auth** Top-up |
| GET | `/agents/customers` | planned | **auth** End customers |
| POST | `/agents/customers` | planned | **auth** Add customer |

---

## Offers & Loyalty

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/offers` | planned | Active offers |
| POST | `/offers/apply` | planned | **auth** Apply to booking |
| GET | `/loyalty` | planned | **auth** Points balance |
| POST | `/loyalty/redeem` | planned | **auth** Redeem points |

---

## Insurance

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/insurance/plans` | planned | Travel insurance plans |
| POST | `/insurance/select` | planned | **auth** Attach to booking |

---

## Admin

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/admin/bookings` | planned | **admin** Filtered list |
| GET | `/admin/users` | planned | **admin** User management |
| POST | `/admin/trains` | planned | **admin** Add/update train |
| POST | `/admin/quota-management` | planned | **admin** Quota allocation |
| GET | `/admin/fraud-flags` | planned | **admin** Suspicious activity |

---

## Reports & Analytics

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/reports/revenue` | planned | **admin** Revenue |
| GET | `/reports/bookings` | planned | **admin** Booking stats |
| GET | `/reports/popular-routes` | planned | **admin** Top corridors |
| GET | `/analytics/dashboard` | planned | **admin** Live KPIs |
| GET | `/analytics/occupancy` | planned | **admin** Train occupancy |

---

## Support & Content

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/history` | live | Railway timeline |
| GET | `/dashboard` | live | **auth** User dashboard (prototype) |
| POST | `/support/tickets` | planned | **auth** Raise ticket |
| POST | `/feedback` | planned | **auth** Trip feedback |

---

## Audit

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/audit/logs` | planned | **admin** System audit trail |
| GET | `/audit/bookings` | planned | **admin** Booking audit |
