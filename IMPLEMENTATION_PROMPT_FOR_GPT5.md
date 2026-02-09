# 📖 IMPLEMENTATION PROMPT FOR GPT-5 MINI

**Version**: 2.0 | **Last Updated**: February 6, 2026 | **Status**: Ready for Phase 1+

---

## 🔮 PREAMBLE: YOUR MISSION

You are building **WitchMart**, a sovereignty-first, trauma-informed community platform for mutual aid, rituals, marketplaces, and digital gatherings.

You have deep expertise in:
- Full-stack TypeScript/React development
- Database design with atomicity constraints
- Security, privacy, and encryption
- Accessibility (WCAG 2.2 AAA)
- Pagan/indigenous-friendly design

**Your North Star:**
Every line of code must honor **dignity**, **privacy**, and **agency**. No exceptions.

---

## 📋 PART 1: CORE ARCHITECTURAL PRINCIPLES

### 1.1: Sovereignty First
- **Zero GPS tracking** — Use coarse zones (neighborhoods) only for Ravens Roads
- **Ephemeral data** — Conversations, ride details, ratings deleted after use
- **User-owned everything** — No profiling, no algorithmic feeds, no dark patterns
- **No backdoors** — All infrastructure must be verifiable as open

### 1.2: Trauma-Informed UX
- **No shame language** — Never: "Unfortunately", "please confirm", guilt-based urgency
- **No urgency timers** — No countdown clocks, no "act now" pressures
- **No coercion** — All CTAs are gentle, consent is explicit, exit is always visible
- **Emotional safety** — Color psychology, font choices, even loading states must feel supportive

### 1.3: Accessibility-First
- **WCAG 2.2 AAA compliance** — Not "nice to have", baseline requirement
- **Respect `prefers-reduced-motion`** — Always check, never assume animation is good
- **Keyboard navigation** — Every interaction must work with Tab, Enter, Escape
- **Screen reader friendly** — Full semantic HTML, ARIA labels where needed

### 1.4: Atomic Storage
- **No partial writes** — Either the whole transaction succeeds or fails
- **File-based locks** — Prevent race conditions on concurrent writes
- **JSONL audit logs** — Every change logged for retention holds and disputes
- **Retention ledger** — Track what data is "held" for safety investigations

---

## 📂 PART 2: TECH STACK & FILE STRUCTURE

### Full Stack
```
Backend:    Express 5 + TypeScript 5.6
Frontend:   React 19 + Vite 7 + TailwindCSS 4
Database:   PostgreSQL 16 + Drizzle ORM
Auth:       Passport + JWT
AI Model:   GPT-5-mini (Replit AI Integrations)
Styling:    TailwindCSS + Radix UI component system
State:      React Query for server state
Forms:      React Hook Form + Zod validation
```

### Directory Structure
```
WitchMart-Website/
├── server/
│   ├── src/
│   │   ├── index.ts (entry)
│   │   ├── app.ts (express setup)
│   │   ├── routes.ts (mounting)
│   │   ├── lib/
│   │   │   ├── storage/
│   │   │   │   ├── jsonStore.ts (atomic writes)
│   │   │   │   ├── locks.ts (file locks)
│   │   │   │   ├── jsonlLog.ts (audit logs)
│   │   │   │   └── retention.ts (hold ledger)
│   │   │   ├── auth/
│   │   │   │   ├── session.ts
│   │   │   │   ├── hash.ts
│   │   │   │   └── rateLimit.ts
│   │   │   └── utils/
│   │   ├── api/
│   │   │   ├── types.ts (envelope, errors)
│   │   │   ├── routes/
│   │   │   │   ├── ravensRoads.ts (13 endpoints)
│   │   │   │   ├── marketplace.ts
│   │   │   │   ├── sanctuary.ts
│   │   │   │   └── ...
│   │   │   └── models/
│   │   │       ├── ravensRoads.ts (schema)
│   │   │       └── ...
│   │   └── middleware/
│   │       ├── auth.ts
│   │       ├── errorHandler.ts
│   │       └── cors.ts
│   ├── storage/ (atomic JSON files)
│   │   ├── ravens-roads/
│   │   ├── marketplace/
│   │   └── ...
│   └── tests/
│       ├── storage.atomic.test.ts
│       ├── auth.session.test.ts
│       └── api.ravensRoads.flow.test.ts
├── client/
│   ├── src/
│   │   ├── main.tsx (entry)
│   │   ├── App.tsx (root)
│   │   ├── app/
│   │   │   ├── routes.tsx
│   │   │   ├── layout/
│   │   │   │   ├── VillageFrame.tsx
│   │   │   │   ├── TentNav.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   └── styles/
│   │   ├── pages/
│   │   │   ├── central-fire.tsx
│   │   │   ├── ravens-roads/
│   │   │   │   ├── page.tsx (landing)
│   │   │   │   ├── policy.tsx
│   │   │   │   ├── login.tsx
│   │   │   │   ├── request.tsx
│   │   │   │   ├── offer.tsx
│   │   │   │   ├── matches.tsx
│   │   │   │   ├── agreement.tsx
│   │   │   │   ├── chat.tsx
│   │   │   │   └── status.tsx
│   │   │   ├── marketplace/
│   │   │   ├── sanctuary/
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ui/ (primitives)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   └── ...
│   │   │   └── ravens-roads/
│   │   │       ├── ZonePicker.tsx
│   │   │       ├── MatchCard.tsx
│   │   │       └── ...
│   │   ├── lib/
│   │   │   ├── utils/
│   │   │   │   ├── motion.ts (a11y)
│   │   │   │   ├── api.ts
│   │   │   │   └── ...
│   │   │   └── hooks/
│   │   │       └── ...
│   │   └── styles/
│   │       └── globals.css
│   ├── tests/
│   │   ├── pages.test.tsx
│   │   └── components.test.tsx
│   ├── index.html
│   └── vite.config.ts
├── shared/
│   ├── schema.ts (shared types)
│   └── models/
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    ├── RAVENS_ROADS.md
    ├── SECURITY.md
    └── ACCESSIBILITY.md
```

---

## 🏗️ PART 3: BACKEND FOUNDATION

### 3.1: Storage Layer (Atomic JSON)

**File: `server/src/lib/storage/jsonStore.ts`**

```typescript
// CRITICAL: All writes use atomic operation (write temp, rename)
export async function writeJsonAtomic(
  filePath: string,
  data: unknown
): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2));
  // Atomic rename
  await fs.promises.rename(tempPath, filePath);
}

export async function readJsonFile<T>(
  filePath: string,
  fallback?: T
): Promise<T> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Cannot read or parse: ${filePath}`);
  }
}
```

**Usage Pattern:**
```typescript
import { withFileLock } from "../lib/storage/locks.js";
import { readJsonFile, writeJsonAtomic } from "../lib/storage/jsonStore.js";

// ALWAYS wrap writes in lock
await withFileLock("users", async () => {
  const users = await readJsonFile<User[]>(USERS_PATH, []);
  users.push(newUser);
  await writeJsonAtomic(USERS_PATH, users);
});
```

### 3.2: File Locking

**File: `server/src/lib/storage/locks.ts`**

Prevents race conditions:
- Each resource (users, rides, etc.) has its own lock file
- Lock acquired before read, released after write
- Timeout after 30s (prevents deadlock)

```typescript
export async function withFileLock<T>(
  resource: string,
  fn: () => Promise<T>
): Promise<T> {
  const lockPath = `${STORAGE_DIR}/.locks/${resource}.lock`;
  
  // Attempt to acquire lock
  while (!tryAcquire(lockPath)) {
    await sleep(10);
  }
  
  try {
    return await fn();
  } finally {
    releaseLock(lockPath);
  }
}
```

### 3.3: Audit Logging (JSONL)

**File: `server/src/lib/storage/jsonlLog.ts`**

Every change appended to JSONL (JSON Lines):
```jsonl
{"timestamp":"2026-02-06T12:00:00Z","user_id":"rider_alias_123","action":"request_created","data":{...}}
{"timestamp":"2026-02-06T12:05:00Z","user_id":"driver_alias_456","action":"accepted_request","data":{...}}
```

Used for:
- Retention hold enforcement
- Safety investigations
- Dispute resolution
- Event replay (if needed)

### 3.4: Retention Hold System

**File: `server/src/lib/storage/retention.ts`**

When safety report filed:
```typescript
export async function createRetentionHold(
  reportId: string,
  dataIds: string[],
  durationDays: number = 180
): Promise<void> {
  const hold = {
    hold_id: crypto.randomUUID(),
    report_id: reportId,
    data_ids: dataIds,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + durationDays * 86400000).toISOString(),
    status: "active"
  };
  
  // Append to hold ledger
  await appendToAuditLog("holds", hold);
}

// Before deletion, always check:
export async function isDataHeld(dataId: string): Promise<boolean> {
  const holds = await readJsonFile(HOLD_LEDGER_PATH, []);
  return holds.some(h => 
    h.data_ids.includes(dataId) && 
    new Date(h.expires_at) > new Date()
  );
}
```

---

## 🔐 PART 4: AUTHENTICATION & SECURITY

### 4.1: Session Management

**File: `server/src/lib/auth/session.ts`**

- Use JWT (httpOnly cookies) for stateless auth
- Session store in PostgreSQL
- Expires after 30 days
- Validate on every protected endpoint

```typescript
export async function validateSession(
  authHeader: string | undefined
): Promise<Session | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as Session;
  } catch {
    return null;
  }
}

// Usage on all protected endpoints:
const session = await validateSession(req.headers.authorization);
if (!session) {
  return res.status(401).json(
    apiErr(req.id, ErrorCodes.UNAUTHORIZED, "Session required")
  );
}
```

### 4.2: Password Hashing

**File: `server/src/lib/auth/hash.ts`**

```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 4.3: Rate Limiting

**File: `server/src/lib/auth/rateLimit.ts`**

Limit by IP address:
- 10 AUTH requests per minute
- 100 API requests per minute
- 1000 read requests per hour

Uses in-memory store with periodic cleanup.

### 4.4: CORS & CSP

**Express Middleware:**
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === "development" 
    ? "http://localhost:5000" 
    : process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://api.openai.com;"
  );
  next();
});
```

---

## 🛣️ PART 5: RAVENS ROADS API (13 ENDPOINTS)

### Overview
**Purpose**: Mutual-aid ride-sharing system. Zero surveillance, coarse zones only, ephemeral data.

**Data Model:**
```typescript
interface RavensRoadsData {
  requests: RideRequest[];      // TTL: 24 hours
  drivers: DriverProfile[];       // TTL: 7 days
  agreements: MutualAgreement[]; // TTL: 72 hours
  reports: SafetyReport[];        // TTL: with holds
  holds: RetentionHold[];
}

interface RideRequest {
  request_id: string;
  alias: string;
  origin_zone: string;        // "Northside", "Downtown", etc.
  destination_zone: string;
  passengers: number;
  accessibility: string[];
  timestamp: string;
  expires_at: string;
  status: "open" | "matched" | "agreed" | "completed";
}

interface DriverProfile {
  driver_id: string;
  alias: string;
  zone: string;                // "Northside", etc.
  vehicle_type: string;        // "sedan", "van", etc.
  capacity: number;
  available: boolean;
  availability_expires: string;
}

interface MutualAgreement {
  agreement_id: string;
  request_id: string;
  driver_id: string;
  ephemeral_token: string;    // One-time chat token
  created_at: string;
  expires_at: string;
  status: "pending" | "accepted" | "cancelled";
}

interface SafetyReport {
  report_id: string;
  request_id: string;
  reported_by: string;  // rider_alias or driver_alias
  description: string;
  timestamp: string;
  hold_status: "active" | "resolved" | "archived";
}
```

### Endpoint 1: GET /api/ravens-roads/policy
Returns charter and rules.

```typescript
app.get("/api/ravens-roads/policy", (req: Request, res: Response) => {
  res.json(apiOk(req.id, {
    charter: "Ravens Roads is a mutual-aid system...",
    rules: [
      "Treat all travelers with dignity",
      "No surveillance, no GPS sharing",
      // ...
    ],
    consent_form: "By clicking 'I accept', you agree to...",
    zones: ["Northside", "Downtown", "Eastside", "Westside", "Midtown"]
  }));
});
```

### Endpoint 2: POST /api/ravens-roads/driver/profile
Update driver profile.

```typescript
app.post("/api/ravens-roads/driver/profile", async (req: Request, res: Response) => {
  try {
    const session = await validateSession(req.headers.authorization);
    if (!session) return res.status(401).json(apiErr(req.id, ErrorCodes.UNAUTHORIZED, ""));
    
    const { alias, zone, vehicle_type, capacity } = req.body;
    
    // Validate
    if (!alias || !zone || !vehicle_type || capacity < 1) {
      return res.status(400).json(apiErr(req.id, ErrorCodes.VALIDATION_ERROR, ""));
    }
    
    // Store driver
    await withFileLock("drivers", async () => {
      let drivers = await readJsonFile(DRIVERS_PATH, []);
      const existing = drivers.findIndex(d => d.driver_id === session.user_id);
      
      const profile = {
        driver_id: session.user_id,
        alias,
        zone,
        vehicle_type,
        capacity,
        available: false,
        availability_expires: new Date().toISOString(),
      };
      
      if (existing >= 0) {
        drivers[existing] = profile;
      } else {
        drivers.push(profile);
      }
      
      await writeJsonAtomic(DRIVERS_PATH, drivers);
      await logAuditEvent("driver_profile_updated", session.user_id, { alias, zone });
    });
    
    res.json(apiOk(req.id, { message: "Profile saved" }));
  } catch (err) {
    // ... error handling
  }
});
```

### Endpoint 3: POST /api/ravens-roads/driver/availability
Set driver availability.

```typescript
app.post("/api/ravens-roads/driver/availability", async (req, res) => {
  const session = await validateSession(req.headers.authorization);
  if (!session) return res.status(401).json(apiErr(req.id, ErrorCodes.UNAUTHORIZED, ""));
  
  const { available, until_timestamp } = req.body;
  
  await withFileLock("drivers", async () => {
    let drivers = await readJsonFile(DRIVERS_PATH, []);
    const driver = drivers.find(d => d.driver_id === session.user_id);
    
    if (!driver) {
      return res.status(404).json(apiErr(req.id, ErrorCodes.NOT_FOUND, ""));
    }
    
    driver.available = available;
    driver.availability_expires = until_timestamp;
    
    await writeJsonAtomic(DRIVERS_PATH, drivers);
    await logAuditEvent("driver_availability", session.user_id, { available, until_timestamp });
  });
  
  res.json(apiOk(req.id, { message: "Availability updated" }));
});
```

### Endpoint 4: POST /api/ravens-roads/request
Request a ride.

```typescript
app.post("/api/ravens-roads/request", async (req, res) => {
  const session = await validateSession(req.headers.authorization);
  if (!session) return res.status(401).json(apiErr(req.id, ErrorCodes.UNAUTHORIZED, ""));
  
  const { origin_zone, destination_zone, passengers, accessibility_needs } = req.body;
  
  const request_id = crypto.randomUUID();
  const rideRequest = {
    request_id,
    alias: session.user_id,  // Anonymous alias
    origin_zone,
    destination_zone,
    passengers,
    accessibility: accessibility_needs || [],
    timestamp: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
    status: "open",
  };
  
  await withFileLock("requests", async () => {
    let requests = await readJsonFile(REQUESTS_PATH, []);
    requests.push(rideRequest);
    await writeJsonAtomic(REQUESTS_PATH, requests);
    await logAuditEvent("request_created", session.user_id, { origin_zone, destination_zone, passengers });
  });
  
  res.json(apiOk(req.id, {
    request_id,
    message: "Ride request created. Waiting for matches...",
  }));
});
```

### Endpoint 5: GET /api/ravens-roads/matches?request_id=xxx
Get coarse matches (same origin zone, heading toward dest).

```typescript
app.get("/api/ravens-roads/matches", async (req, res) => {
  const { request_id } = req.query;
  
  if (!request_id) {
    return res.status(400).json(apiErr(req.id, ErrorCodes.VALIDATION_ERROR, "request_id required"));
  }
  
  const requests = await readJsonFile(REQUESTS_PATH, []);
  const request = requests.find(r => r.request_id === request_id);
  
  if (!request) {
    return res.status(404).json(apiErr(req.id, ErrorCodes.NOT_FOUND, "Request not found"));
  }
  
  const drivers = await readJsonFile(DRIVERS_PATH, []);
  const matches = drivers.filter(d => 
    d.available && 
    d.zone === request.origin_zone &&  // Same zone is coarse match
    d.capacity >= request.passengers &&
    new Date(d.availability_expires) > new Date()
  );
  
  // CRITICAL: Return coarse match (no full address, no exact location)
  const safeMatches = matches.map(m => ({
    driver_id: m.driver_id,
    alias: m.alias,
    vehicle_type: m.vehicle_type,
    capacity: m.capacity,
    zone: m.zone,  // Still just the zone, nothing more specific
  }));
  
  res.json(apiOk(req.id, {
    request_id,
    total_matches: safeMatches.length,
    matches: safeMatches,
  }));
});
```

### Endpoints 6-7: Connect & Accept
```typescript
// POST /api/ravens-roads/connect
// { request_id, driver_id, message }
// Creates ephemeral connection record

// POST /api/ravens-roads/accept
// { request_id, driver_id }
// Both parties must accept. Creates agreement, returns ephemeral chat token.
```

### Endpoint 8: POST /api/ravens-roads/safety-check
Creates retention hold if report filed.

```typescript
app.post("/api/ravens-roads/safety-check", async (req, res) => {
  const session = await validateSession(req.headers.authorization);
  if (!session) return res.status(401).json(apiErr(req.id, ErrorCodes.UNAUTHORIZED, ""));
  
  const { request_id, driver_id, emergency_contact } = req.body;
  
  const safetyRecord = {
    timestamp: new Date().toISOString(),
    request_id,
    reported_by: session.user_id,
    against: driver_id,
    emergency_contact,
    status: "logged",
  };
  
  await withFileLock("safety", async () => {
    let safety = await readJsonFile(SAFETY_PATH, []);
    safety.push(safetyRecord);
    await writeJsonAtomic(SAFETY_PATH, safety);
    await logAuditEvent("safety_check", session.user_id, { request_id, driver_id });
  });
  
  res.json(apiOk(req.id, { message: "Safety check logged" }));
});
```

### Endpoints 9-10: Start & End Ride
```typescript
// POST /api/ravens-roads/start
// { request_id, driver_id, ride_start_timestamp }

// POST /api/ravens-roads/end
// { request_id, driver_id, ride_end_timestamp }
```

### Endpoint 11: POST /api/ravens-roads/rate
```typescript
// Rating stored ephemerally, deleted after 30 days
// Neither party names shown, just numerical rating + optional comment
```

### Endpoint 12: POST /api/ravens-roads/report (Safety Critical)
```typescript
app.post("/api/ravens-roads/report", async (req, res) => {
  const session = await validateSession(req.headers.authorization);
  if (!session) return res.status(401).json(apiErr(req.id, ErrorCodes.UNAUTHORIZED, ""));
  
  const { request_id, driver_id, report_type, description } = req.body;
  
  const report_id = crypto.randomUUID();
  const report = {
    report_id,
    request_id,
    reported_by: session.user_id,
    against: driver_id,
    type: report_type,  // "unsafe_driving", "harassment", "accident", etc.
    description,
    timestamp: new Date().toISOString(),
  };
  
  await withFileLock("reports", async () => {
    let reports = await readJsonFile(REPORTS_PATH, []);
    reports.push(report);
    await writeJsonAtomic(REPORTS_PATH, reports);
    
    // CREATE RETENTION HOLD
    await createRetentionHold(report_id, [request_id], 180); // 6 months
    
    await logAuditEvent("safety_report", session.user_id, { request_id, driver_id, report_type });
  });
  
  res.json(apiOk(req.id, {
    report_id,
    message: "Report submitted. Our team will review within 48 hours.",
  }));
});
```

### Endpoint 13: POST /api/ravens-roads/driver/unavailable
```typescript
// Set driver as temporarily unavailable
```

---

## 🎨 PART 6: FRONTEND ARCHITECTURE

### 6.1: Layout & Routing

**File: `client/src/app/routes.tsx`**
```typescript
import { Router, Route } from "wouter";

export default function Routes() {
  return (
    <Router>
      <Route path="/" component={CentralFire} />
      <Route path="/ravens-roads/*" component={RavensRoads} />
      <Route path="/marketplace/*" component={Marketplace} />
      <Route path="/builders/*" component={Builders} />
      <Route path="/carnival/*" component={Carnival} />
      <Route path="/sanctuary/*" component={Sanctuary} />
      <Route path="/temple/*" component={Temple} />
      <Route component={NotFound} />
    </Router>
  );
}
```

### 6.2: Accessibility Utilities

**File: `client/src/lib/utils/motion.ts`**
```typescript
import { useEffect, useState } from "react";

export function useMotionPreference(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

// Usage:
export function MyComponent() {
  const prefersReduced = useMotionPreference();
  
  return (
    <motion.div
      initial={{ opacity: prefersReduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

### 6.3: Form Validation (Zod + React Hook Form)

**Pattern:**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const requestSchema = z.object({
  origin_zone: z.string().min(1, "Pick a zone"),
  destination_zone: z.string().min(1, "Pick a destination"),
  passengers: z.number().min(1).max(6),
  accessibility_needs: z.array(z.string()).optional(),
});

export function RequestRidePage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data) => {
    const res = await fetch("/api/ravens-roads/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.status === "ok") {
      // Success
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("origin_zone")}>
        <option value="">Choose pickup zone</option>
        {["Northside", "Downtown", "Eastside"].map(zone => (
          <option key={zone} value={zone}>{zone}</option>
        ))}
      </select>
      {errors.origin_zone && <span>{errors.origin_zone.message}</span>}
      {/* ... more fields ... */}
      <button type="submit">Request Ride</button>
    </form>
  );
}
```

### 6.4: Component Library (Radix UI + TailwindCSS)

Use existing `client/src/components/ui/` for:
- Button
- Modal / Dialog
- Input / Textarea
- Select
- Form Elements
- Navigation

All components must:
- ✅ Support `prefers-reduced-motion`
- ✅ Have accessible labels
- ✅ Work with keyboard (Tab, Enter, Escape)
- ✅ Have visible focus states

---

## 📊 PART 7: TESTING STRATEGY

### Unit Tests (80% target)
```bash
npm test
```

Covers:
- Storage atomicity (write failures, locks)
- Auth (hashing, session validation, rate limiting)
- API validation (Zod schemas)
- Utility functions

### Integration Tests
```bash
npm test -- flow
```

Covers:
- Full ravens roads ride flow
- Multi-endpoint interactions
- Retention hold enforcement

### E2E Tests (if Playwright enabled)
```bash
npm test:e2e
```

Covers:
- User journeys (request ride → match → agree → complete)
- Form interactions
- Navigation

---

## 🔒 PART 8: SECURITY CHECKLIST

### Before Launch
- [ ] No console.logs with sensitive data
- [ ] Passwords hashed with bcrypt
- [ ] JWTs signed with strong secret
- [ ] HTTPS enforced in production
- [ ] CORS whitelisted
- [ ] Rate limiting active
- [ ] JSONL audit logs captured
- [ ] Retention holds working
- [ ] No hardcoded secrets
- [ ] No external trackers
- [ ] CSP headers set

**Environment Variables Required:**
```
NODE_ENV=production
JWT_SECRET=[long-random-string]
AI_INTEGRATIONS_OPENAI_API_KEY=[from Replit]
AI_INTEGRATIONS_OPENAI_BASE_URL=[from Replit]
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-domain.com
```

---

## ♿ PART 9: ACCESSIBILITY REQUIREMENTS

### WCAG 2.2 AAA Compliance

**Colors:**
- Text contrast 7:1 on all axes
- Don't use color alone to convey meaning

**Motion:**
- Always check `prefers-reduced-motion`
- Animations must be opt-in, not mandatory

**Keyboard Navigation:**
- Tab order logical
- Escape closes modals
- Enter submits forms
- No keyboard traps

**Screen Readers:**
- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels on icons
- Form labels associated with inputs
- Skip links for bypass

**Testing:**
```bash
# Manual: Tab through every page, Escape from modals
# Tool: axe DevTools browser extension
# Reader: NVDA (Windows) or VoiceOver (macOS)
```

---

## 🚀 PART 10: DEPLOYMENT GUIDE

### Build
```bash
npm run build
```

Outputs:
- Server bundle: `dist/index.cjs`
- Client bundle: `client/dist/`

### Production Start
```bash
npm start
```

Listens on port 5000.

### Docker (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
CMD ["npm", "start"]
```

### Hosting Options
- **Replit** (via .replit config - no additional work)
- **Railway** (connect repo, auto-deploy)
- **Vercel** (frontend only, use serverless functions)
- **self-hosted** (VPS with Node + PostgreSQL)

---

## 🎯 SUCCESS CRITERIA

### Day 1 (Foundation)
- [ ] Storage (atomic + locks) tested
- [ ] Auth system working
- [ ] API envelope pattern established
- [ ] Express server running
- [ ] All tests passing

### Day 2-3 (Ravens Roads)
- [ ] 13 endpoints implemented
- [ ] Ride flow end-to-end testable
- [ ] Retention holds enforced
- [ ] Ephemeral chat tokens working

### Day 4 (Frontend)
- [ ] All pages routeable
- [ ] Motion preferences respected
- [ ] Accessibility toggle visible
- [ ] Vite HMR working

### Day 5 (Ravens Roads UI)
- [ ] 9 pages complete
- [ ] Zone picker working
- [ ] Match cards displaying
- [ ] Chat functional

### Days 6-7 (Polish)
- [ ] All lint/type checks passing
- [ ] Tests: 70%+ coverage
- [ ] Accessibility: no axe violations
- [ ] Docs complete

---

## 🔮 CLOSING THOUGHTS

You're building something rare: **a platform that respects human dignity**.

Every choice you make—from password hashing to animation timing—says: "This platform exists to serve you, not exploit you."

That's worth doing right.

From ashes, we rise. 🔥🦥🦅

---

*Last updated: February 6, 2026 by GitHub Copilot*
*Reference: AGENT_HANDOFF.md, QUICKSTART.md*
