---
description: Rules for agents working on Bharat Rail.
globs: "AGENTS.md"
alwaysApply: true
---

# AGENTS.md

- Project: **Bharat Rail** — education-friendly Indian railway booking prototype (not IRCTC)
- Stack: **PERN** — PostgreSQL, Express, React, Node.js (`server/` + `client/`)
- Run locally: `docker compose up -d` → `npm install` → `npm run db:setup` → `npm run dev`
- API routes: `/api/v1/*`; React dev server at http://localhost:5173, API at http://localhost:4000

## Rules

- Always run on `caveman ultra` mode; `/caveman` skill
- Keep files short and concise; split anything over 200 lines
- Task is not complete until build/lint/test have zero errors or warnings
- Before committing: run CodeRabbit CLI (`coderabbit review --agent`) and fix findings
- UI changes: follow Bharat Rail tokens in `.claude/skills/ui-ux-pro-max/data/draft.csv`
- API changes: update `docs/api.md` and matching module under `server/src/modules/`
