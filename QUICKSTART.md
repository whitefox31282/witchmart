# ⚡ QUICKSTART: WitchMart Implementation Phases

**Duration**: 7 days | **Difficulty**: Expert | **Team**: Solo Agent + Code Review

---

## 📋 BEFORE YOU START

1. Read `AGENT_HANDOFF.md` (current status) - 5 min
2. Read `IMPLEMENTATION_PROMPT_FOR_GPT5.md` (full spec) - 60 min
3. Read this file completely - 10 min
4. Install dependencies: `npm install` ✓ (already done)
5. Verify dev server works: `npm run dev:client` (should show Vite running on :5000)

---

## 🎯 PHASE 1: FOUNDATION (Day 1)

### Goal
Create the core storage, auth, and API infrastructure so all endpoints have same foundation.

### Tasks

#### 1a. Storage Layer (Atomic JSON)
**Files to create:**
- `server/src/lib/storage/jsonStore.ts` 
- `server/src/lib/storage/locks.ts`
- `server/src/lib/storage/jsonlLog.ts`

**Requirements:**
- ✅ Atomic writes (write to temp, rename)
- ✅ File-based locks to prevent race conditions
- ✅ JSONL audit logs for retention/safety holds
- ✅ TypeScript strict mode
- ✅ Full test coverage

**Verify:**
```bash
# Create test file
server/tests/storage.atomic.test.ts
npm test -- storage.atomic
# Should: All locks work, writes are atomic, no corruption on crash
```

#### 1b. Auth System
**Files to create:**
- `server/src/lib/auth/session.ts` - JWT/session management
- `server/src/lib/auth/hash.ts` - Password hashing (bcrypt)
- `server/src/lib/auth/rateLimit.ts` - Rate limiting middleware

**Requirements:**
- ✅ Session validation decorator
- ✅ Bcrypt password hashing
- ✅ Rate limiting (10 req/min per IP)
- ✅ Session store (PostgreSQL)

**Verify:**
```bash
server/tests/auth.session.test.ts
# Should: Sessions work, rate limiting blocks, hashing is secure
```

#### 1c. API Envelope & Errors
**Files to create:**
- `server/src/api/types.ts` - Response wrapper types
- `server/src/api/errors.ts` - Error code enum

**Response Pattern** (MUST use everywhere):
```typescript
// Success
{ status: "ok", data: {...}, requestId: "req-123" }

// Error
{ status: "error", code: "RESOURCE_NOT_FOUND", message: "...", requestId: "req-123" }
```

#### 1d. Express Setup
**Files to create/update:**
- `server/src/app.ts` - Express app config
- `server/src/index.ts` - Server entry (update if needed)
- `server/src/routes.ts` - Route mounting (update)
- `server/src/middleware/` - CORS, logging, etc.

**Requirements:**
- ✅ CORS configured (only localhost:5000 in dev)
- ✅ JSON body parser limit 10MB
- ✅ Request ID middleware
- ✅ Error handler (global)
- ✅ 404 handler

**Verify:**
```bash
npm run build
npm start
# Should: Server starts on port 5000, responds to GET /health with { status: "ok" }
```

---

## 🛣️ PHASE 2: RAVENS ROADS BACKEND (Days 2-3)

### Goal
Implement complete ride-sharing API with 13 endpoints, ephemeral chat, safety holds.

### Requirements (Non-negotiable)
- ❌ NO GPS tracking
- ❌ NO persistent rider/driver data
- ❌ NO location history storage
- ✅ Coarse zones only (neighborhoods, regions)
- ✅ Ephemeral ride context
- ✅ Mutual safety protocols
- ✅ Retention holds for safety reports

### The 13 Endpoints (In Order)

#### Endpoint 1: Policy
```
GET /api/ravens-roads/policy
Returns charter, rules, consent form
```

#### Endpoints 2-3: Profile & Availability (Auth Required)
```
POST /api/ravens-roads/driver/profile
{ alias, zone, vehicle_type, capacity }

POST /api/ravens-roads/driver/availability
{ available: true, until_timestamp }
```

#### Endpoint 4: Request Ride
```
POST /api/ravens-roads/request
{ origin_zone, destination_zone, passengers, accessibility_needs }
Response: { request_id, waiting_hint }
```

#### Endpoint 5: Get Matches
```
GET /api/ravens-roads/matches?request_id=xxx
Returns coarse matches (same origin zone + heading toward dest)
CRITICAL: No exact locations
```

#### Endpoint 6: Propose Connection
```
POST /api/ravens-roads/connect
{ request_id, driver_id, message }
Ephemeral: stored only until ride ends
```

#### Endpoint 7: Accept Mutual Agreement
```
POST /api/ravens-roads/accept
{ request_id, driver_id }
Both parties must consent. Returns encrypted ephemeral chat link.
```

#### Endpoint 8: Safety Check
```
POST /api/ravens-roads/safety-check
{ request_id, driver_id, photo_consent, emergency_contact }
Creates retention HOLD if safety report filed.
```

#### Endpoint 9-10: Ride Status (Start & End)
```
POST /api/ravens-roads/start
{ request_id, driver_id, ride_start_timestamp }

POST /api/ravens-roads/end
{ request_id, driver_id, ride_end_timestamp }
```

#### Endpoint 11: Rate
```
POST /api/ravens-roads/rate
{ request_id, driver_id, rating, comment }
EPHEMERAL: Deleted after 30 days
```

#### Endpoint 12: Report (Safety Critical)
```
POST /api/ravens-roads/report
{ request_id, driver_id, report_type, description, evidence }
Sets RETENTION HOLD for 6 months on all related data
```

#### Endpoint 13: Driver Unavailable
```
POST /api/ravens-roads/driver/unavailable
{ driver_id, until_timestamp }
```

### Database Schema
**File:** `server/src/api/models/ravensRoads.ts`

Required tables:
- `raven_requests` - Rides in flight (TTL: 24 hours)
- `raven_drivers` - Driver availability (TTL: 7 days)
- `raven_agreements` - Mutual consent records (TTL: 72 hours)
- `raven_reports` - Safety reports with holds (TTL: varies)
- `raven_hold_ledger` - Retention hold tracking

### Retention Hold System
**File:** `server/src/lib/storage/retention.ts`

When a safety report filed:
1. Create hold entry: `{ report_id, data_ids_to_hold, expiry: now + 6 months }`
2. Before any deletion, check hold ledger
3. If held, skip deletion until hold expires

### Tests
**File:** `server/tests/api.ravensRoads.flow.test.ts`

**Scenarios to test:**
1. Full happy-path ride (request → match → agree → start → end → rate)
2. Driver unavailable middle of ride (should handle gracefully)
3. Safety report filed (should create hold)
4. Data deletion respects holds
5. Chat is truly ephemeral (deleted after ride ends)

**Run:**
```bash
npm test -- ravensRoads.flow
```

---

## 🏪 PHASE 3: OTHER TENTS BACKEND (Day 3)

### Goal
Scaffold all 7 tent APIs with basic CRUD.

### The 7 Tents
1. **Ravens Roads** ✅ (Phase 2)
2. **Marketplace** - Buy/sell crafts
3. **Builders & Makers** - Workshops, tools, guilds
4. **Carnival** - Events, performances, joy
5. **Sanctuary** - Nodes directory (healing, refuge)
6. **Temple** - Ritual, spiritual resources
7. **Guilds** (embedded in Builders) - Artisans, herbalists, smiths, etc.

### Each Tent Needs
- Schema file: `server/src/models/{tent}.ts`
- Routes file: `server/src/api/routes/{tent}.ts`
- CRUD endpoints: GET, POST, PUT, DELETE
- Storage folder: `server/storage/{tent}/`

### Minimal Endpoints Per Tent
```
# Template
GET /api/{tent}
GET /api/{tent}/:id
POST /api/{tent}
PUT /api/{tent}/:id
DELETE /api/{tent}/:id
```

**No detailed spec needed yet** - just scaffold.

---

## 🎨 PHASE 4: FRONTEND FOUNDATION (Day 4)

### Goal
Create layout, routing, and component system for all pages.

### Layout Files
**File:** `client/src/app/App.tsx` - App wrapper
**File:** `client/src/app/routes.tsx` - Routing table
**File:** `client/src/app/layout/VillageFrame.tsx` - Main shell

**Requirements:**
- ✅ Tent navigation visible
- ✅ Page component mounting
- ✅ Error boundary wrapping
- ✅ Accessibility toggle (top-right)

### Motion System (Critical for a11y)
**File:** `client/src/lib/utils/motion.ts`

```typescript
export function useMotionPreference() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }
  return false
}

// Usage in components:
const prefersReduced = useMotionPreference()
return (
  <motion.div
    initial={{ opacity: prefersReduced ? 1 : 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: prefersReduced ? 0 : 0.3 }}
  />
)
```

### All Pages (Placeholder Content OK)
- `client/src/pages/central-fire.tsx` - Home
- `client/src/pages/ravens-roads/page.tsx` - Landing
- `client/src/pages/marketplace/page.tsx` - Marketplace
- `client/src/pages/builders/page.tsx` - Builders
- `client/src/pages/carnival/page.tsx` - Carnival
- `client/src/pages/sanctuary/page.tsx` - Sanctuary
- `client/src/pages/temple/page.tsx` - Temple
- `client/src/pages/not-found.tsx` - 404

**Verify:**
```bash
npm run dev:client
# Should: Click each page, no errors, motion works
```

---

## 🚗 PHASE 5: RAVENS ROADS UI (Days 4-5)

### Goal
Build complete traveler + driver flow without backend initially.

### Pages (9 total)
1. **RavensRoads Landing** - Policy, rules, CTA
2. **Rules Gate** - Charter acceptance check
3. **Alias Login** - Anonymous auth
4. **Request Ride** - Zone picker, passenger form
5. **Offer Ride** - Driver profile, capacity
6. **Matches** - Coarse matches, not exact
7. **Agreement** - Mutual consent form
8. **Chat** - Ephemeral, disappears after ride
9. **Ride Status** - Start/end, rate, report

### Components
- `ZonePicker.tsx` - Coarse zone selector (no GPS)
- `MatchCard.tsx` - Shows matched riders/drivers (no addresses)
- `Button.tsx` - Accessible, motion-aware
- `Modal.tsx` - Consent/confirmations

### Wireframe
```
Landing → Charter→ Alias Auth → Choose: RequestRide or OfferRide
    ↓
  if Request: RequestRide → Matches → Agreement → Chat ← RideStatus
    ↓
  if Drive: OfferRide → Matches ← Agreement ← Chat ← RideStatus
```

**Verify:**
```bash
# Can fill out flow (no API yet, localStorage state)
# Motion preferences respected
# All buttons accessible
```

---

## 🎪 PHASE 6: OTHER TENTS UI (Days 5-6)

### Goal
Build landing pages for all 7 tents.

### Per Tent: Minimal Page
- Name/description
- Grid of items (from API or mock)
- Search/filter (basic)
- "Add item" CTA (for auth)

No advanced filtering yet.

**Verify:**
```bash
# Can navigate all tents
# Pages load without errors
```

---

## ✅ PHASE 7: POLISH & TESTING (Day 6-7)

### Testing
```bash
# Unit tests
npm test

# E2E tests (if Playwright installed)
npm run test:e2e

# Type safety
npm run check

# Lint (when configured)
npm run lint
```

### Accessibility Audit
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader works (test with NVDA or JAWS)
- [ ] Color contrast 7:1 for text
- [ ] Motion respected (prefers-reduced-motion)
- [ ] Focus states visible

### Security Checklist
- [ ] CSP configured
- [ ] CORS restricted
- [ ] Rate limiting active
- [ ] Sessions secure
- [ ] No GPS/tracking

### Documentation
- [ ] API docs (OpenAPI/Swagger)
- [ ] Deployment guide
- [ ] Contributing guide
- [ ] Architecture diagram

---

## 📊 DAILY CHECKLIST

**Every morning:**
- [ ] Read relevant phase section
- [ ] Know what today's commit message will say
- [ ] Verify no dead code/console.logs

**Every build:**
- [ ] `npm run check` passes
- [ ] `npm test` passes (at least unit tests)
- [ ] `npm run dev` starts (or `npm run dev:client`)

**Every evening:**
- [ ] Commit with clear message
- [ ] Push to repo
- [ ] Update this checklist

---

## 🆘 TROUBLESHOOTING

### "Module not found"
→ `npm install` and check imports use `.js` extension

### "Type error on line 1"
→ Delete `node_modules/.vite` and restart dev server

### "EADDRINUSE localhost:5000"
→ Kill old Vite: `lsof -i :5000` then `kill -9 <PID>`

### "Tenant not rendering"
→ Check route in `routes.tsx`, verify page file exists

### "Motion not working"
→ Confirm `useMotionPreference()` hook is imported correctly

---

## 🎯 DEFINITION OF DONE

### Backend
- [ ] All 7 tent APIs respond
- [ ] Ravens Roads: 13 endpoints complete
- [ ] Auth works (sessions, rate limit)
- [ ] Storage is atomic (no corruption)
- [ ] Tests: 80%+ coverage
- [ ] Docs: API docs exist

### Frontend
- [ ] All 7 tents navigable  
- [ ] Ravens Roads: 9 pages complete
- [ ] Motion preferences respected
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] No console errors
- [ ] Tests: 60%+ coverage

### Security
- [ ] No trackers
- [ ] No GPS (zones only)
- [ ] CORS configured
- [ ] Rate limiting active

### Documentation
- [ ] AGENT_HANDOFF.md ✓
- [ ] IMPLEMENTATION_PROMPT.md ✓
- [ ] QUICKSTART.md ✓
- [ ] API.md
- [ ] DEPLOYMENT.md

---

## 🚀 LAUNCH READINESS

When all phases complete:

```bash
npm run build
npm start
# Open: https://yoursite.com
```

First production check:
1. Can register alias (Ravens Roads)
2. Can request ride
3. Can view sanctuary nodes
4. Can browse marketplace
5. No console errors

---

**Good luck, builder. The ravens are watching.** 🦅
