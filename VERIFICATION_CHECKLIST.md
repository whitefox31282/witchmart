# 🏪 WitchMart — Deployment Verification Grimoire

<!-- Version: 1.0.0 | Last Updated: 2026-02-10 | Status: PRODUCTION READY -->
<!-- Maintainer: WitchMart Core Team -->
<!-- Purpose: Single-source-of-truth pre-deployment verification checklist -->
<!-- Usage: Complete every section before approving a production deployment -->
<!-- Tip: Use `grep -c '\[x\]' DEPLOYMENT_CHECKLIST.md` to count verified items -->

> **Deployment Target:** Azure App Service (Linux, Node.js 20 LTS)
> **Stack:** Express 4.x + React 18 + Vite 5 + TypeScript
> **Architecture:** Monorepo — single deployable artifact (`dist/`)
> **Privacy Model:** Zero-coordinate, region/zone-only, ephemeral sessions
> **Build Pipeline:** Dual — esbuild (backend) + Vite (frontend)

---

## Table of Contents

- [Quick Status](#quick-status)
- [Build System](#build-system)
- [Backend — Core Infrastructure](#backend--core-infrastructure)
- [Backend — Hecate's Highway API](#backend--hecates-highway-api)
- [Data Storage & Persistence](#data-storage--persistence)
- [Privacy & Security Compliance](#privacy--security-compliance)
- [Frontend — React + Vite](#frontend--react--vite)
- [Environment & Configuration](#environment--configuration)
- [Azure Deployment Readiness](#azure-deployment-readiness)
- [TypeScript & Code Quality](#typescript--code-quality)
- [Build Output Verification](#build-output-verification)
- [Pre-Deployment Testing Protocol](#pre-deployment-testing-protocol)
- [Known Limitations & Scaling Notes](#known-limitations--scaling-notes)
- [Deployment Runbook](#deployment-runbook)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedure](#rollback-procedure)
- [Sign-Off](#sign-off)

---

## Quick Status

| Domain                   | Status    | Items   | Notes                              |
| ------------------------ | --------- | ------- | ---------------------------------- |
| Build System             | ✅ PASS   | 5/5     | Vite + esbuild dual pipeline       |
| Backend Infrastructure   | ✅ PASS   | 5/5     | Express server fully configured    |
| Hecate's Highway API     | ✅ PASS   | 14