# Architecture

## Goal

Bharat Rail is currently a working prototype. It proves the product flow and UI: search, results, booking, dashboard, dining, live status, and railway history.

A real national ticketing platform must be designed as a distributed system. The target mentioned earlier, 500 million requests in 1 minute, is about 8.3 million requests per second. That cannot be solved by one server, one database, or one framework.

## Prototype Architecture

```text
Browser
  |
  | HTTP
  v
C++ web server
  |
  | serves static files and JSON
  v
In-memory seeded data
```

This is intentionally simple so the app runs locally without downloads.

## Production Architecture

```text
Users
  |
CDN + WAF + Bot Protection
  |
Global Load Balancers
  |
Envoy API Gateway
  |
Service Mesh
  |
+----------------------+----------------------+----------------------+
| Search Service       | Booking Service      | Payment Service      |
| C++ Drogon/Beast     | C++ Drogon/Beast     | C++ or JVM/Go        |
+----------------------+----------------------+----------------------+
  |                      |                      |
Redis Cluster           Distributed SQL         Payment Gateway
Kafka/Redpanda          PostgreSQL shards       Audit Ledger
OpenTelemetry           Idempotency Store       Notification Queue
```

## Recommended Production Tools

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui or Radix UI
- Backend: C++20/23, Drogon or Boost.Beast, gRPC, Protocol Buffers
- Database: PostgreSQL for MVP, CockroachDB/YugabyteDB or sharded PostgreSQL for large scale
- Cache: Redis Cluster
- Queue: Kafka or Redpanda
- Gateway: Envoy, Nginx, or HAProxy
- Runtime: Docker, Kubernetes, Helm
- Infrastructure: Terraform, Argo CD
- Observability: OpenTelemetry, Prometheus, Grafana, Loki, Tempo/Jaeger
- Security: Cloudflare/Akamai WAF, OAuth2/OIDC, mTLS, Vault/KMS, OWASP ASVS, SAST/DAST, container scanning
- Load testing: k6, wrk2, Gatling, Locust

## Ticket Booking Safety

Booking is not just an HTTP problem. It needs correctness.

- Use idempotency keys for every booking and payment attempt.
- Lock or atomically reserve seat inventory.
- Keep booking, payment, and ticket issue flows event-driven.
- Use a saga pattern for long-running booking and payment workflows.
- Store immutable audit events for every price, seat, and payment decision.
- Never trust fare totals from the browser.
- Rate-limit login, OTP, search, and payment endpoints separately.

## Scaling Strategy

- Put static assets behind a CDN.
- Cache search responses and train metadata aggressively.
- Keep live availability as short-lived Redis snapshots.
- Route booking writes to strongly consistent storage.
- Split services by business boundary: identity, search, availability, booking, payment, notification, loyalty, audit.
- Use regional active-active for reads and carefully controlled active-primary for seat allocation.
- Design degradation modes: queue booking, delay analytics, preserve core search and ticket issue.
