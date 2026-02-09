# 🔮 AGENT HANDOFF: WitchMart-Website

**Status**: Foundation complete. Backend and frontend frameworks operational.
**Current Model**: GPT-5 mini enabled for all clients
**Date**: February 6, 2026

---

## 📊 WHAT'S DONE

### Backend (Express + TypeScript)
- ✅ Core Express server running
- ✅ Route structure established
- ✅ Replit AI Integrations set up (audio, chat, image)
- ✅ SetAI chat system with invocation phrases
- ✅ GPT-5 mini enabled for SetAI and general chat
- ✅ Database foundation (Drizzle ORM with PostgreSQL)
- ✅ Storage layer configured

### Frontend (React + Vite)
- ✅ Vite dev server operational (port 5000)
- ✅ React 19 + TypeScript configured
- ✅ TailwindCSS 4 integrated
- ✅ UI component library (Radix UI) installed
- ✅ Routing system (Wouter) configured
- ✅ Theme system (next-themes) ready

### Infrastructure
- ✅ npm dependencies resolved
- ✅ TypeScript configuration complete
- ✅ ESBuild optimizations in place
- ✅ Cross-platform compatibility fixed (cross-env)

---

## 🎯 NEXT WORK (PRIORITY ORDER)

### Phase 1: Core Pages & Navigation (This Week)
1. **Central Fire (Home Page)** - Village landing, tent directory
2. **Error Boundary & Layout** - Global error handling, navigation frame
3. **All 7 Tents** - Basic landing pages for each

### Phase 2: Ravens Roads Implementation
- Complete ride-sharing system (13 API endpoints)
- Ephemeral chat (no logs, no storage)
- Safety protocols and mutual-aid flow

### Phase 3: Other Tents (Marketplace, Builders, etc.)
- CRUD for each tent's data model
- Database schema finalization
- Validation and error handling

### Phase 4: Polish & Security
- Accessibility audit (WCAG 2.2 AAA)
- Security hardening
- Performance optimization
- Documentation

---

## 🚀 HOW TO RUN

### Start Client Only (Vite)
```bash
npm run dev:client
# Opens: http://localhost:5000
```

### Start Full Stack (Both Server + Client)
**On macOS/Linux:**
```bash
npm run dev (server) &
npm run dev:client (client)
```

**On Windows (from WSL terminal):**
```bash
npm run dev
# Then in another WSL terminal:
npm run dev:client
```

### Build for Production
```bash
npm run build
npm start
```

---

## 🔑 KEY FILES TO KNOW

- `server/index.ts` - Express server entry
- `server/routes.ts` - Route mounting
- `server/setai-chat.ts` - SetAI backend (GPT-5 mini enabled)
- `client/src/main.tsx` - React entry point
- `client/src/App.tsx` - Main app component
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript config

---

## ⚠️ KNOWN ISSUES & WORKAROUNDS

### Windows + WSL Path Issue
**Problem**: Running `npm run dev` from Windows PowerShell against WSL paths fails
**Solution**: 
- Run commands from **within WSL terminal** instead of Windows PowerShell
- Or copy project to Windows-native path (C:\ drive) and run from there

### Environment Variables
- ✅ Fixed: Now using `cross-env` for cross-platform NODE_ENV support
- Scripts like `npm run dev` and `npm start` now work on all platforms

### TypeScript Compilation
- Since running from UNC paths, `npm run check` may show warnings
- Actual build (`npm run build`) works fine via tsx

---

## 📝 ARCHITECTURAL DECISIONS

1. **Atomic JSON Storage**: All data stored as atomic JSON files with file locks
2. **Sovereignty-First**: No tracking, GPS, or backdoors - coarse zones only for Ravens Roads
3. **Ephemeral Chat**: SetAI conversations not logged (per user request)
4. **Trauma-Informed UX**: No urgency, no shame language, respectful tone always
5. **Accessibility First**: WCAG 2.2 AAA compliance target, motion preferences respected
6. **GPT-5 Mini**: Efficient, fast inference for all AI operations

---

## 🛠️ TECH STACK SUMMARY

| Layer | Tech | Version |
|-------|------|---------|
| **Frontend** | React | 19.2.0 |
| **Client Build** | Vite | 7.1.9 |
| **Backend** | Express | 5.0.1 |
| **Language** | TypeScript | 5.6.3 |
| **Styling** | TailwindCSS | 4.1.14 |
| **Database** | PostgreSQL | 16 |
| **ORM** | Drizzle | 0.39.3 |
| **Auth** | Passport | 0.7.0 |
| **AI Model** | GPT-5 mini | via Replit |

---

## 📊 METRICS & HEALTH CHECK

```bash
# Check dependencies
npm list --depth=0

# Run type check
npm run check

# Build test
npm run build

# Lint (when configured)
npm run lint
```

---

## 🤝 NEXT AGENT NOTES

When handing off to the next agent/phase:

1. **Read IMPLEMENTATION_PROMPT_FOR_GPT5.md** first (comprehensive spec)
2. **Follow QUICKSTART.md** for phase-by-phase steps
3. **Always test locally** with `npm run dev:client` + separate server
4. **Commit frequently** with clear messages
5. **Don't modify canon** - keep all lore, tent names, and structure exactly as specified
6. **Trauma-informed always** - no dark patterns, no urgency, no coercion

---

## ✨ VISION REMINDER

You're building a **digital sanctuary** for people who deserve:
- **Dignity** (no shame, no coercion)
- **Privacy** (no surveillance, no GPS)
- **Agency** (real choice, real consent)
- **Community** (mutual aid, genuine connection)

Every line of code honors this mission. 🦥
