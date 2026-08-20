# ZoneIn Hub

A coworking day-pass booking site. A quiet place to get work done in Alagbado, Lagos: stable power, reliable internet, and a calm room, ten desks split across two walls.

This is a private, closed-source project. Not for redistribution.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Framer Motion
- **Backend**: Express, TypeScript, better-sqlite3 (SQLite, WAL mode)
- **PDF tickets**: jsPDF + qrcode

## Project structure

```
src/                    Frontend (Vite root)
  components/
    zonein/              Shared design-system pieces (DeskLayout, FloatingShapes, FadeIn, ImageSlot, FaqAccordion)
    Header.tsx, Footer.tsx, Logo.tsx
  pages/                 One file per route
  context/BookingContext.tsx   Desk/booking state, talks to the API
  utils/                 api.ts (fetch wrapper), contact.ts (address/phone/map), ticket.ts (PDF), helpers.ts

server/                 Backend (separate npm workspace)
  src/
    db/                  database.ts (schema), seed.ts (desk seed data)
    routes/              desks, bookings, otp, admin
    types/
```

## Domain model

- Ten desks (`D1`–`D10`): six along the right wall, four along the left, with a walkway between.
- A single flat day-pass rate (see `DAY_RATE_NGN` in `src/context/BookingContext.tsx` and `server/src/routes/bookings.ts`, kept in sync).
- Booking identity is a name + phone number, verified with a one-time code. **The OTP flow is currently a placeholder** (`server/src/routes/otp.ts`): it accepts any 4-digit code and does not send a real SMS. Wire up a real provider there before relying on it for anything beyond a soft identity check.
- Staff/admin access (`/admin`) is gated by a password checked server-side against `ADMIN_PASSWORD` (see Environment variables below), never hardcoded into the frontend bundle.

## Setup

Requires Node 18+.

```bash
npm install
cd server && npm install && cd ..
```

Run both the frontend and backend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001 (Vite proxies `/api` to it in dev)

Or run them separately: `npm run dev:client` / `npm run dev:server`.

## Environment variables

None are required for local development (sensible defaults apply). For a real deployment, set:

| Variable | Where | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | server | Staff login password for `/admin`. **Required in production**; the server refuses to start without it outside dev. |
| `CORS_ORIGIN` | server | Allowed origin for the deployed frontend (defaults to `*`). |
| `VITE_API_URL` | frontend build | Base URL for the API if the backend isn't served at `/api` on the same origin. |
| `PORT` | server | Port the API listens on (defaults to `3001`). |

## Build

```bash
npm run build          # frontend -> dist/
cd server && npm run build   # backend -> server/dist/
```

## Notes

- The SQLite database file (`server/data.db*`) is a local runtime artifact, not committed; it's recreated and seeded automatically on first run.
- Contact/location details (address, phone, map embed) live in one place: `src/utils/contact.ts`.
- Brand colors, fonts, and the wordmark logo are centralized in `src/index.css` (design tokens) and `src/components/Logo.tsx`.
