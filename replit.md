# WitchMart

## Overview

WitchMart is a member-owned, Pagan-aligned cooperative marketplace and sanctuary network. The platform allows users to find local sanctuary nodes, connect with makers and guilds, explore products and services, and join the community. It features a full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

**Protected by SetAI** - A sovereignty-first, zero-exploitation, trauma-informed platform with no corporate trackers or data mining.

## SetAI Sovereignty Layer

### Core Principles
- **Zero Surveillance**: No Google Analytics, Meta pixels, or third-party trackers
- **Data Sovereignty**: Users own 100% of their data; only anonymous session IDs are used
- **Transient Storage**: All session data is stored in browser sessionStorage only
- **Instant Revocation**: Users can clear all data with one click
- **Harm Prevention**: Content is scanned for potential harm with double-confirmation warnings

### SetAI Components
- `client/src/lib/setai-gate.ts` - Core consent, harm detection, and revocation logic
- `client/src/components/setai-consent-modal.tsx` - Consent flow and harm warning modals
- `client/src/components/ravens-whisper.tsx` - Floating chat placeholder with mythic framing
- `client/src/components/grounding-statement.tsx` - Trauma-informed grounding with crisis resources
- `client/src/components/setai-footer.tsx` - Footer with transparency link and revoke button
- `client/src/pages/transparency.tsx` - Transparency log page

### Mythic Design System
- **Colors**: Midnight (#0A1F44), Forest (#2E4A2E), Parchment (#F5E8C7), Iron (#4B4B4B)
- **Fonts**: Cinzel (runic headers), Merriweather (body)
- **Imagery**: Ravens as watchers, runes as guidance, Yggdrasil knotwork

### Crisis Resources
- 988 Suicide & Crisis Lifeline
- Trans Lifeline: 877-565-8860
- Trevor Project: 866-488-7386
- Crisis Text Line: Text HOME to 741741

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration
- **UI Components**: Radix UI primitives with custom styling, Lucide icons

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **API Design**: RESTful JSON API under `/api/*` routes
- **Validation**: Zod schemas with drizzle-zod integration
- **Error Handling**: Centralized error responses with zod-validation-error

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `db:push` command
- **Tables**: sanctuary_nodes, makers, products_services, member_signups, contact_submissions, blog_posts

### Project Structure
- `client/` - React frontend application
- `server/` - Express backend with routes, storage layer, and static file serving
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

### Build and Development
- Development runs Vite dev server with HMR proxied through Express
- Production builds client to `dist/public` and bundles server with esbuild
- Server serves static files from built client in production

## External Dependencies

### Database
- PostgreSQL (required, connection via DATABASE_URL environment variable)
- Drizzle ORM for type-safe database queries
- connect-pg-simple for session storage

### Frontend Libraries
- @tanstack/react-query for data fetching
- recharts for data visualization (pricing transparency charts)
- embla-carousel-react for carousels
- react-day-picker for calendar components
- react-hook-form with zod resolver for form handling

### UI Framework
- shadcn/ui components (full component library installed)
- Radix UI primitives for accessible components
- class-variance-authority for component variants
- tailwind-merge and clsx for class utilities

### Development Tools
- Vite with React plugin and Tailwind CSS plugin
- TypeScript with strict mode
- Custom Vite plugins for Replit integration (dev banner, cartographer, meta images)