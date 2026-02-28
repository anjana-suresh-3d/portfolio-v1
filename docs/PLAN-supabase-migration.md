# Supabase Migration Plan

## Goal
Switch the portfolio backend from **SQLite + local file uploads** to **Supabase** (free tier) for production-ready database and file storage.

---

## What Changes

| Component | Current | After |
|-----------|---------|-------|
| **Database** | SQLite (local `dev.db`) | Supabase PostgreSQL |
| **File Storage** | Local `/public/uploads/` | Supabase Storage buckets |
| **Auth** | NextAuth v5 (credentials) | Keep NextAuth (works with any DB) |
| **ORM** | Prisma 7 + better-sqlite3 adapter | Prisma 7 + `@prisma/adapter-pg` |

> [!NOTE]
> **Frontend, 3D components, admin panel, and all pages stay untouched.** Only the database connection and upload API change.

---

## Setup Guide (You Do This First)

### Step 1: Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)** → Sign up / Log in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `anjana-portfolio`
   - **Database Password**: (save this — you'll need it)
   - **Region**: Choose closest to your users (e.g., `South Asia (Mumbai)`)
4. Wait ~2 minutes for the project to spin up

### Step 2: Get Connection Strings

1. In your Supabase dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Copy the **URI** format connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
4. Also copy the **Direct connection** string (for migrations):
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### Step 3: Create Storage Bucket

1. In Supabase dashboard → **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Name it: `portfolio-assets`
4. Toggle **"Public bucket"** → ON (so images are publicly accessible)
5. Click **Create**

### Step 4: Get API Keys

1. Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL**: `https://[project-ref].supabase.co`
   - **anon/public key**: (starts with `eyJ...`)
   - **service_role key**: (starts with `eyJ...` — keep secret!)

### Step 5: Give Me the Values

Once you have these, share them with me (or paste into `.env.local`):

```env
# Supabase
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

---

## Code Changes (I Do This After Setup)

### Phase 1: Database Switch
- **`prisma/schema.prisma`** → Change provider to `postgresql`
- **`prisma.config.ts`** → Update datasource URL
- **`src/lib/prisma.js`** → Swap adapter from `better-sqlite3` to `@prisma/adapter-pg`
- Run `npx prisma db push` to create tables in Supabase

### Phase 2: File Upload Switch
- **`src/lib/supabase.js`** → [NEW] Supabase client for storage
- **`src/app/api/upload/route.js`** → Replace local filesystem writes with Supabase Storage uploads

### Phase 3: Cleanup
- Remove `better-sqlite3` and `@prisma/adapter-better-sqlite3` deps
- Install `@supabase/supabase-js` and `@prisma/adapter-pg`
- Delete local `prisma/dev.db`

---

## Verification

- [ ] Projects API returns `[]` from Supabase DB
- [ ] Admin login works
- [ ] Create project via admin → saved in Supabase DB
- [ ] Upload image → stored in Supabase Storage bucket
- [ ] Upload 3D model → stored in Supabase Storage
- [ ] Project detail page shows uploaded images and 3D viewer

---

## Free Tier Limits (Supabase)

| Resource | Limit |
|----------|-------|
| Database | 500 MB |
| Storage | 1 GB |
| Bandwidth | 2 GB/month |
| Auth users | 50,000 MAU |
| Edge Functions | 500K invocations |
| Realtime | 200 concurrent |

> [!TIP]
> For a portfolio site, you'll never hit these limits. Even with 50+ projects with images and 3D models, you'd use ~200-300 MB total.
