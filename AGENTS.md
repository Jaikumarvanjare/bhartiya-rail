---
description: Rules for agents working on Bharat Rail.
globs: "AGENTS.md"
alwaysApply: true
---

# AGENTS.md

- Project: **Bharat Rail** — education-friendly Indian railway booking prototype (not IRCTC)
- Stack: Java 17, Spring Boot 3, Maven (`backend/`); HTML, CSS, JavaScript (`public/`)
- Run locally: `npm run dev:backend` → http://localhost:8080
- API routes: `/api/*`; static UI served from `public/`

## Rules

- Always run on `caveman ultra` mode; `/caveman` skill
- Use `./mvnw` in `backend/` for Java builds; `npm run dev:backend` for local dev
- Keep files short and concise; split anything over 200 lines
- Task is not complete until build/lint/test have zero errors or warnings
- Before committing: run CodeRabbit CLI (`coderabbit review --agent`) and fix findings
- UI changes: follow Bharat Rail tokens in `.claude/skills/ui-ux-pro-max/data/draft.csv`
