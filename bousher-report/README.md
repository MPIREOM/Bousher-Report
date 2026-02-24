# Bousher Report — MPIRE Rent Collection Dashboard

Executive dashboard for tracking rent collection across 50 units in Bousher, Muscat.

## Features

- **Upload-based** — Drop your `GENERAL_REPORT.xlsx` to populate the dashboard
- **4 Tabs** — Overview, Monthly Detail, Tenants, Payment History
- **MPIRE / OWNER split** — Track collections by payment recipient
- **At-risk tenants** — Automatic flagging of late payers
- **Payment heatmap** — Visual history across all months

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Recharts
- SheetJS (xlsx parsing)
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload your Excel file.

## Excel Format

The dashboard expects a `.xlsx` file with these sheets:
- **DASHBOARD** — Monthly KPI summary
- **Tenant Master** — All 50 units with tenant details
- **Payment History** — Month-by-month payment status
- **Monthly sheets** (e.g. `FEBRUARY 26`) — Detailed per-unit payments
- **Vacancy Tracker** — Occupancy data

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MPIREOM/Bousher-Report)
