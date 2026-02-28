# Orchestration Plan: Cross-Device Connectivity & Ethical Asset Management

**Goal**: Enable seamless portfolio management and viewing from any device while maintaining professional security standards and ethical data practices.

---

## 🎼 Orchestration Report (Phase 1: Planning)

### Mode
- [x] **PLANNING** (Sequential)
- [ ] IMPLEMENTATION (Parallel)

### Agents Involved
| Agent | Role | Focus |
|-------|------|-------|
| `project-planner` | Architect | Overall structure and task breakdown |
| `security-auditor` | Ethicist/Security | Public vs Private bucket assessment, Auth integrity |
| `backend-specialist` | Engineer | Proxy implementation & dynamic host logic |

---

## 🔍 Problem Analysis

The system currently fails on non-local devices due to:
1.  **Auth Lock**: `NEXTAUTH_URL` is pin-pointed to `127.0.0.1`.
2.  **DNS/Network Fragility**: Relying on direct browser access to `supabase.co` which is often throttled or blocked by ISPs/Corporate Firewalls.
3.  **CORS Misconfiguration**: Direct browser uploads are rejected by Supabase because the origin (local IP) isn't whitelisted.

---

## 🛡️ The "Correct & Ethical" Way (Architectural Decisions)

### 1. The "Public Bucket" Trade-off (Security Perspective)
- **Decision**: We will keep the `portfolio-assets` bucket **Public** for performance and ease of access for *truly public* assets (thumbnails, project images).
- **Ethics**: We MUST NOT store sensitive data (admin sessions, raw contact form exports, etc.) in this bucket.
- **Verification**: Ensure no private fields are leaked in project metadata.

### 2. The Robust Image Proxy (Technical Perspective)
- **Decision**: Implement a server-side proxy (`/api/proxy-image`) as the *primary* delivery method for all assets.
- **Why**: 
    - Bypasses ISP DNS issues (traffic looks like it's coming from your portfolio domain).
    - Centralizes CORS handling.
    - Allows us to add server-side caching/optimization later.

### 3. Dynamic Host Awareness (Auth Perspective)
- **Decision**: Remove absolute URL dependencies. Use `trustHost: true` in NextAuth and dynamic environment resolution.

---

## 🛠️ Proposed Changes

### Phase A: Foundation (Security & Backend)
1.  **[MODIFY] [.env]**: Remove `NEXTAUTH_URL` to allow dynamic resolution.
2.  **[MODIFY] [src/lib/auth.js]**: Ensure `trustHost: true` is set.
3.  **[NEW] [src/app/api/proxy-image/route.js]**: Edge-runtime image proxy.

### Phase B: Core Implementation
1.  **[MODIFY] [src/lib/supabase.js]**: Add `getProxiedUrl` helper.
2.  **[MODIFY] [src/app/api/projects/route.js]**: wrap all image URLs in the proxy.
3.  **[MODIFY] [src/app/api/content/route.js]**: wrap global brand/loader/favicon URLs in the proxy.

### Phase C: Polish & UI
1.  **[MODIFY] [src/app/admin/page.js]**: Improve `handleUpload` with detailed network error diagnostics (CORS vs Offline).

---

## ✅ Verification Checklist

- [ ] Access Admin from mobile IP -> Login works (Dynamic Host)
- [ ] View Projects from tablet -> Thumbnails appear (Proxy)
- [ ] Upload from different device -> Successful (CORS Settings applied by user + Proxy preview)

---

**Approval Required**: Please review this plan. If you agree this is the "correct and ethical" way, I will proceed to Phase 2 (Implementation).
