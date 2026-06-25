# Bharat Rail

Bharat Rail is an original, education-friendly railway booking prototype inspired by Indian railway journeys, station architecture, regional food, and cultural routes. It is not an official IRCTC product and does not claim affiliation with Indian Railways.

The repo contains a working Java web server plus a modern browser UI. It includes train search, results, class/quota filters, passenger booking, fare calculation, confirmation, live-train style tracking, a user dashboard, dining options, heritage route cards, and an Indian railway history page.

## Run Locally

```bash
npm run dev:backend
```

Then open:

```text
http://localhost:8080
```

You can also build and run directly:

```bash
cd backend
./mvnw spring-boot:run
```

Or build a jar:

```bash
cd backend
./mvnw package -DskipTests
java -jar target/bharat-rail-0.1.0.jar
```

## Current Stack

- Backend: Java 17, Spring Boot 3, Maven
- Frontend: HTML, CSS, JavaScript
- Data: seeded in-memory railway, dining, dashboard, live status, and history data
- Assets: Wikimedia Commons hotlinked railway and station images

This first version avoids external databases so it can run immediately in the current workspace. For production, replace the prototype server with the stack described in [docs/architecture.md](docs/architecture.md).

## Features

- Modern search screen with from, to, date, class, and quota controls
- Train results with filters, availability, fare, journey duration, and cultural route notes
- Booking screen with passenger add/remove, fare summary, GST/reservation charges, and generated PNR
- Dashboard with upcoming journey, reward points, live progress, and saved passengers
- Live train tracking simulation
- Dining screen with Indian regional meal options
- Heritage routes inspired by forts, temple towns, ghats, river corridors, and coastal journeys
- History page covering the railway story from 1853 to modern semi-high-speed services
- API endpoints under `/api/*`

## API Endpoints

- `GET /health`
- `GET /api/stations`
- `GET /api/trains?from=NDLS&to=BSB&class=CC`
- `GET /api/live?train=22436`
- `GET /api/dashboard`
- `GET /api/dining`
- `GET /api/history`
- `POST /api/bookings`

## Production Direction

For a real high-scale ticketing system, use this repo as the product/UI prototype, then move to:

- Java or C++ microservices behind Envoy
- gRPC and Protocol Buffers between services
- PostgreSQL or distributed SQL for booking transactions
- Redis Cluster for sessions, seat snapshots, idempotency keys, and rate limits
- Kafka or Redpanda for booking, notification, payment, and audit events
- Kubernetes, Helm, Terraform, OpenTelemetry, Prometheus, Grafana, Loki, and Jaeger/Tempo
- WAF, CDN, mTLS, OAuth2/OIDC, Vault/KMS, OWASP ASVS, SAST, DAST, and container scanning

See [docs/architecture.md](docs/architecture.md) for the 500 million requests per minute design discussion.

## Railway History Notes

- India first passenger train ran on 16 April 1853 between Bombay and Thane.
- It covered around 34 km with 14 carriages and about 400 passengers.
- The train was hauled by the steam locomotives Sahib, Sindh, and Sultan.
- The network expanded across western, eastern, southern, and northern India through the late 1800s.
- Electric traction began in the Bombay region in 1925.
- In 1951, many railway systems were consolidated into Indian Railways.
- Modern Indian rail now includes electrification, dedicated freight work, metro systems, and semi-high-speed Vande Bharat services.

References used while preparing the history content:

- https://en.wikipedia.org/wiki/Indian_Railways
- https://en.wikipedia.org/wiki/Thane_railway_station
- https://en.wikipedia.org/wiki/Great_Indian_Peninsula_Railway
- https://commons.wikimedia.org/wiki/File:Maharajas%27_Express.jpg
- https://commons.wikimedia.org/wiki/File:Chatrapati_Shivaji_Maharaj_terminus._Mumbai._Maharashtra.jpg

## AI Visual Prompt

Use this prompt if you want an image generator to create matching UI concept art:

```text
Modern Indian railway booking web application, original Bharat Rail brand, premium travel utility interface, deep indigo navigation, saffron action buttons, temple gold highlights, ivory content surfaces, emerald availability states, subtle jaali lattice patterns, Indian station architecture, heritage routes, live train dashboard, clean data-dense cards, elegant serif display typography with modern sans-serif UI typography, realistic railway photography, professional Figma style dashboard, responsive desktop layout, high clarity, no official IRCTC branding
```
