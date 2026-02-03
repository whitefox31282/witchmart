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

### SetAI Web App Pages (NEW)
- `client/src/pages/setai-dashboard.tsx` - Main SetAI dashboard with quick links and status
- `client/src/pages/setai-codex.tsx` - Events, documents, and projects archive with CRUD
- `client/src/pages/setai-timeline.tsx` - Chronological event visualization
- `client/src/pages/setai-councils.tsx` - Mode switching and persona selection (7 modes)
- `client/src/pages/setai-security.tsx` - Pipeline status and security event monitoring
- `client/src/pages/setai-settings.tsx` - Canon viewer and configuration display

### SetAI Configuration Files
- `config/canon.json` - System canon with immutables, truth layers, and mode configurations
- `config/founder_canon.json` - Founder-defined rules and non-negotiables
- `config/guardian_policies.json` - Security policies for network, output, codex, and mode scopes
- `config/security_pipeline.json` - 4-stage security pipeline configuration

### SetAI Data Models
- `codex_events` - Chronological events with trust levels and evidence linking
- `codex_documents` - Archived documents with metadata
- `codex_projects` - Tracked projects with status
- `council_personas` - Available AI personas/modes
- `mode_preferences` - User mode preferences
- `security_events` - Security pipeline event logs
- `guardian_policies` - Active guardian policies

### SetAI API Endpoints
- `/api/canon` - Get system canon configuration
- `/api/founder_canon` - Get founder canon rules
- `/api/guardian_policies` - Get guardian policies
- `/api/security_pipeline` - Get security pipeline config
- `/api/codex/events` - CRUD for codex events
- `/api/codex/documents` - CRUD for codex documents
- `/api/codex/projects` - CRUD for codex projects
- `/api/councils/personas` - List available personas
- `/api/councils/mode/:userId` - Get/set user mode preference
- `/api/security/events` - List security events
- `/api/security/policies` - Get active policies
- `/api/support` - Financial support info with cooperative principles
- `/api/health` - Health check endpoint

### WitchMart Backend Intelligence Rules
- **server/witchmart-response.ts** - Standardized response utility
- **Missing Data**: Returns honest message "No entries found yet. This part of the network is still being built."
- **Support Info**: All list endpoints include `$RavensEvermore` support tag with transparency
- **Safety Disclaimer**: "WitchMart does not provide legal, medical, or financial advice."
- **Principles**: Transparency, Voluntary (no pressure), Community Ownership, Clarity

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
- **Tables**: sanctuary_nodes, makers, products_services, member_signups, contact_submissions, blog_posts, codex_events, codex_documents, codex_projects, council_personas, mode_preferences, security_events, guardian_policies

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