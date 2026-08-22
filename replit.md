# Dayflow HRMS

Dayflow is a secure employee workspace for account access and self-service profile details.

## Run & Operate

- `pnpm --filter @workspace/dayflow run dev` — run the Dayflow web app
- `mvn -f backend/pom.xml spring-boot:run` — run the Spring Boot API
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Spring configuration lives in `backend/src/main/resources/application.properties`; replace the MySQL and JWT placeholders before running the API.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- Backend: Spring Boot 3 + Spring Security + JPA
- Database: MySQL
- Authentication: BCrypt password hashing + JWT bearer tokens
- API contract: OpenAPI + Orval-generated React Query hooks

## Where things live

- `artifacts/dayflow/src` — runnable React frontend and auth/profile pages
- `backend/src/main/java/com/dayflow` — Spring Boot user, auth, JWT, and security modules
- `backend/src/main/resources/schema.sql` — MySQL users table definition
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Profile updates intentionally accept only phone, address, and profile picture.
- JWTs carry the employee role and are validated on every protected request.
- The frontend stores the short-lived access token in local storage for browser-session persistence.

## Product

Users can register as an employee or HR user, sign in with email and password, and view or update their own profile contact details.

## User preferences

The user requested a clean, card-based, responsive HRMS experience.

## Gotchas

- Replace the placeholder MySQL credentials and JWT secret before starting Spring Boot.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
