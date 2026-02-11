# 🜂 WitchMart — Cooperative Marketplace & Sanctuary Network

> **Status:** 🚀 Active development • **License:** AGPL-3.0 • **Stack:** React 18 · Express 5 · PostgreSQL · TypeScript • **Last update:** 2026-02-10

---

## Table of Contents

- [Overview](#overview)
- [SetAI Sovereignty Layer](#setai-sovereignty-layer)
  - [Core Principles](#core-principles)
  - [Key Components](#key-components)
  - [Dedicated Pages](#dedicated-pages)
  - [Configuration Files](#configuration-files)
  - [Data Models](#data-models)
  - [API Surface](#api-surface)
- [Mythic Design System](#mythic-design-system)
- [Makers & Guilds](#makers--guilds)
  - [Guild Categories](#guild-categories)
  - [Theme Pack System](#theme-pack-system)
  - [Guild Listing Card Fields](#guild-listing-card-fields)
- [Additional Features](#additional-features)
  - [Gaming Guild (Legacy)](#gaming-guild-legacy)
  - [Sanctuary Node Canonical Fields](#sanctuary-node-canonical-fields)
  - [Receipt Logging System](#receipt-logging-system)
  - [Crisis Resources](#crisis-resources)
- [System Architecture](#system-architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database & Storage](#database--storage)
  - [Project Structure](#project-structure)
  - [Build & Development Flow](#build--development-flow)
- [External Dependencies](#external-dependencies)
- [Quick Start](#quick-start)

---

## Overview

**WitchMart** is a member-owned, Pagan-aligned cooperative marketplace and sanctuary network that helps people:

1. **Find** local sanctuary nodes and safe spaces.  
2. **Connect** with guilds, makers, and service providers.  
3. **Explore** products, rituals, classes, and community events.  
4. **Contribute** to a transparent, sovereignty-first ecosystem.

Full-stack TypeScript powers the platform: a React frontend, an Express backend, and PostgreSQL for durable data. Analytics are opt-in and user-controlled.

---

## SetAI Sovereignty Layer

### Core Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | Zero Surveillance | No GA, Meta pixels, or third-party trackers. |
| 2 | Data Sovereignty | Users own 100 % of their data; only anonymous, ephemeral session IDs are used. |
| 3 | Transient Storage | Session data lives in `sessionStorage` only; nothing in long-term cookies/localStorage. |
| 4 | Instant Revocation | One-click wipe clears session data, cache, and preferences. |
| 5 | Harm Prevention | Client-side harm scan gates user-generated content with double-confirm on potential risk. |

### Key Components

| Path | Purpose |
|------|---------|
| `client/src/lib/setai-gate.ts` | Consent logic, harm detection, revocation utils |
| `client/src/components/setai-consent-modal.tsx` | Consent & harm-warning modal |
| `client/src/components/ravens-whisper.tsx` | Mythic floating chat shell |
| `client/src/components/grounding-statement.tsx` | Crisis-resource banner |
| `client/src/components/setai-footer.tsx` | Footer with transparency link & revoke button |
| `client/src/pages/transparency.tsx` | Real-time audit log & policies |

### Dedicated Pages

`/setai-dashboard`, `/setai-codex`, `/setai-timeline`, `/setai-councils`, `/setai-security`, `/setai-settings`

### Configuration Files

    config/
    ├─ canon.json
    ├─ founder_canon.json
    ├─ guardian_policies.json
    └─ security_pipeline.json

### Data Models

`codex_events`, `codex_documents`, `codex_projects`, `council_personas`, `mode_preferences`, `security_events`, `guardian_policies`

### API Surface

All endpoints live under `/api/*` and return envelope objects via `server/witchmart-response.ts`.

---

## Mythic Design System

| Element | Value |
|---------|-------|
| Palette | Midnight `#0A1F44`, Royal Purple `#5D3A8C`, Parchment `#F5E8C7`, Iron `#4B4B4B` |
| Accessible Text | `#e8dcc8`, `#c5baa8`, `#d4af37`, `#7B4DB8` (WCAG-AA) |
| Fonts | *Cinzel* (headers), *Merriweather* (body) |
| Imagery | Yggdrasil knotwork, runes, **Set the Sloth 🦥** in Buddha pose |
| Component | `SetSlothBuddhaPose.tsx` guardian graphic |

---

## Makers & Guilds

### Guild Categories

1. Game Creators  
2. Artisans  
3. Herbalists & Apothecaries  
4. Diviners & Seers  
5. Smiths & Forgers  
6. Builders & Makers  
7. Textile & Fiber  
8. Ritual & Sacred Craft  
9. Digital Makers  
10. Educators & Skillmasters  

### Theme Pack System

`dnd`, `wow`, `pathfinder`, `elderscrolls`, `norse`, `egyptian`, `celtic`, `slavic`, `custom`

Each pack overrides borders, textures, and accents for guild UI.

### Guild Listing Card Fields

| Field | Notes |
|-------|-------|
| Display Name | Required |
| Guild Category / Subcategory | Required |
| Profile Image / Symbol | Optional |
| Description | Markdown supported |
| Links | Discord, YouTube, TikTok, Instagram, Website, Shop, Email |
| CTA | “View Full Profile” button |

---

## Additional Features

### Gaming Guild (Legacy)

Landing page `/gaming-guild` with eight game columns plus **Gaming Safety Agent** (`/gaming-safety`) using the SetAI consent flow.

### Sanctuary Node Canonical Fields

Fifteen fields (Name → Additional Notes) defined in `docs/sanctuary-fields.md`.

### Receipt Logging System

Public expense ledger tracking item, reason, cost, submitter. **TODO:** server endpoints + DB table.

### Crisis Resources

Quick links: 988 Lifeline · Trans Lifeline · Trevor Project · Crisis Text Line.

---

## System Architecture

### Frontend

- React 18 + TypeScript, functional components  
- Routing via Wouter  
- State with TanStack React Query  
- Tailwind CSS + shadcn/ui (New York style)  
- Build with Vite (meta-image plugin)  
- Radix UI primitives & Lucide icons  

### Backend

- Express 5 (Node 20), REST JSON under `/api`  
- Zod + drizzle-zod validation  
- Uniform envelopes via `witchmart-response.ts`  

### Database & Storage

- PostgreSQL via Drizzle ORM  
- Schema: `shared/schema.ts` (single source of truth)  
- Migrations: Drizzle Kit (`npm run db:push`)  
- Sessions: `connect-pg-simple` (prod) / in-memory (dev)  

### Project Structure

    client/    React app
    server/    Express API & static serving
    shared/    Types & DB schema
    migrations/ SQL migrations
    config/    SetAI & guardian configs
    docs/      Specs & ADRs

### Build & Development Flow

1. `npm run dev` – dev server with HMR proxied through Express  
2. `npm run build` – Vite → `dist/public`, esbuild → `dist/index.cjs`  
3. `npm start` – production Express serving static bundle  

---

## External Dependencies

| Area | Package | Purpose |
|------|---------|---------|
| DB | `pg`, `drizzle-orm`, `connect-pg-simple` | PostgreSQL access & sessions |
| Data Fetching | `@tanstack/react-query` | Server state |
| Charts | `recharts` | Transparency graphs |
| UI | `shadcn/ui`, `@radix-ui/*`, `lucide-react` | Accessible components |
| Forms | `react-hook-form`, `@hookform/resolvers/zod` | Forms & validation |
| Carousels | `embla-carousel-react` | Gallery sliders |
| Utils | `clsx`, `tailwind-merge`, `class-variance-authority` | CSS helpers |
| Tooling | `vite`, `typescript`, `esbuild` | Build pipeline |

---

## Quick Start

    # 1. Clone & install
    pnpm i   # or npm install / yarn

    # 2. Create env file
    cp .env.example .env
    #   – set DATABASE_URL for Postgres

    # 3. Run dev mode
    pnpm run dev   # http://localhost:5173

    # 4. Build & serve
    pnpm run build && pnpm start
    # Express on http://localhost:5000

Need a full deployment checklist? See **VERIFICATION_CHECKLIST.md**.