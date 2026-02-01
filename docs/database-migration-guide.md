# Database Migration Guide

## Prerequisites

### 1. Install Dependencies
```bash
npm install
# nebo
pnpm install
```

**Required packages (already in package.json):**
- `@prisma/client@^7.3.0`
- `@prisma/adapter-pg@^7.3.0`
- `prisma@^7.3.0`
- `pg@^8.18.0`
- `tsx` (for running TypeScript seed files)

### 2. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE ordinace_dental;
CREATE USER ordinace_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ordinace_dental TO ordinace_user;
\q
```

**Option B: Docker PostgreSQL**
```bash
docker run --name ordinace-postgres \
  -e POSTGRES_DB=ordinace_dental \
  -e POSTGRES_USER=ordinace_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**Option C: Hosted (Railway, Supabase, Neon)**
- Railway.app (free tier, easy setup)
- Supabase (free tier s PostgreSQL)
- Neon.tech (serverless PostgreSQL)

### 3. Configure Environment Variables

**Vytvořit `.env` soubor:**
```bash
cp .env.example .env
```

**Editovat `.env`:**
```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://ordinace_user:secure_password@localhost:5432/ordinace_dental?schema=public"

# Další konfigurace...
```

**Connection String Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

---

## Initial Setup (První spuštění)

### Step 1: Generate Prisma Client
```bash
npm run db:generate
```

Tento příkaz:
- Vygeneruje Prisma Client do `src/generated/prisma/`
- Vytvoří type-safe API pro databázi
- Musí se spustit po každé změně `schema.prisma`

### Step 2: Create Initial Migration
```bash
npm run db:migrate
# Pojmenuj migraci: initial_schema
```

Tento příkaz:
- Vytvoří SQL migration soubor v `prisma/migrations/`
- Aplikuje migraci na databázi (vytvoří tabulky)
- Automaticky spustí `prisma generate`

**Výstup:**
```
prisma/migrations/
└── 20260201120000_initial_schema/
    └── migration.sql
```

### Step 3: Seed Database
```bash
npm run db:seed
```

Tento příkaz:
- Vytvoří 5 základních služeb (hygiena, bělení, atd.)
- Data pro development/testing
- **POZOR:** V development módu smaže existující služby!

---

## Development Workflow

### Změna schématu
```bash
# 1. Edituj prisma/schema.prisma
# Např. přidej nový sloupec:
model Booking {
  // ...
  reminderSent Boolean @default(false)
}

# 2. Vytvoř a aplikuj migraci
npm run db:migrate
# Pojmenuj: add_reminder_sent_field

# 3. Vygeneruj client (automaticky při migrate)
# Nebo manuálně:
npm run db:generate
```

### Reset databáze (DEV ONLY!)
```bash
# Smaže VŠECHNA data a znovu aplikuje všechny migrace
npx prisma migrate reset

# Poté seed
npm run db:seed
```

### Prisma Studio (GUI pro databázi)
```bash
npm run db:studio
```
Otevře web GUI na `http://localhost:5555` pro prohlížení a editaci dat.

---

## Production Deployment

### Pre-deployment Checklist
- [ ] Záloha produkční databáze
- [ ] Test migrace na staging prostředí
- [ ] Zkontroluj rollback plán
- [ ] Verify `DATABASE_URL` v production ENV vars

### Step 1: Set Environment Variable
```bash
# Na serveru (VPS, Railway, Vercel, atd.)
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### Step 2: Deploy Migration
```bash
# SSH na server nebo CI/CD pipeline
cd /path/to/app

# Pull latest code
git pull origin main

# Install dependencies
npm install --production=false

# Generate Prisma Client (MUSÍ být před deploy)
npm run db:generate

# Apply migrations (БEZ interaktivního promptu)
npx prisma migrate deploy

# Build aplikace
npm run build

# Restart aplikace (PM2, Docker, atd.)
pm2 restart ordinace-app
```

### Step 3: Verify
```bash
# Zkontroluj logy
pm2 logs ordinace-app

# Test API endpoint
curl https://ordinace.muzx.cz/api/health

# Zkontroluj databázi
psql $DATABASE_URL -c "SELECT COUNT(*) FROM services;"
```

---

## Common Issues & Solutions

### Issue: "DATABASE_URL environment variable is not set"

**Build time (OK):**
```
[Prisma] DATABASE_URL not set - database operations will fail at runtime
```
To je **očekávané chování** při `next build`. Prisma client používá Proxy pattern.

**Runtime (ERROR):**
```
Error: DATABASE_URL environment variable is not set
```
**Řešení:**
1. Zkontroluj `.env` soubor
2. Verify environment variables: `echo $DATABASE_URL`
3. Restart aplikace po změně `.env`

### Issue: "Can't reach database server"

**Symptoms:**
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Řešení:**
```bash
# Zkontroluj že PostgreSQL běží
sudo systemctl status postgresql
# nebo
docker ps | grep postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Zkontroluj firewall (pokud remote DB)
telnet db.host.com 5432
```

### Issue: Migration fails with existing data

**Scenario:** Přidáváš NOT NULL column na neprázdnou tabulku.

**Špatně:**
```prisma
model Booking {
  // ...
  newRequiredField String // Migration selže!
}
```

**Správně:**
```prisma
model Booking {
  // ...
  newRequiredField String? // Nejdřív nullable
}

// Pak v dalším kroku:
// 1. Migrace: přidej nullable
// 2. Data migration: vyplň hodnoty
// 3. Migrace: změň na NOT NULL
```

### Issue: Generated client not found

**Error:**
```
Cannot find module '@/generated/prisma'
```

**Řešení:**
```bash
# Vygeneruj client
npm run db:generate

# Restart dev server
npm run dev
```

### Issue: "Prisma schema validation error"

**Error:**
```
Error validating: Relation field missing `references` argument
```

**Řešení:**
Zkontroluj syntax v `schema.prisma`:
```prisma
// Špatně
model Booking {
  service Service @relation(fields: [serviceId])
}

// Správně
model Booking {
  serviceId String
  service   Service @relation(fields: [serviceId], references: [id])
}
```

---

## Migration Rollback

Prisma nepodporuje automatický rollback. Možnosti:

### Option 1: Database Backup Restore
```bash
# Před migrací
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Rollback
psql $DATABASE_URL < backup_20260201_120000.sql
```

### Option 2: Reverse Migration
```bash
# Vytvoř novou migraci s opačnými změnami
# Např. pokud jsi přidal column, rollback = DROP column

# Edituj schema (vrať zpět)
# Pak:
npm run db:migrate
# Pojmenuj: rollback_feature_xyz
```

### Option 3: Manual SQL
```bash
# Najdi migration.sql soubor
cat prisma/migrations/20260201_add_field/migration.sql

# Vytvoř reverse SQL script
# ALTER TABLE users ADD COLUMN ... → ALTER TABLE users DROP COLUMN ...

# Aplikuj manuálně
psql $DATABASE_URL -f rollback.sql
```

---

## Performance Tips

### Connection Pooling

Prisma 7 s `@prisma/adapter-pg` používá `pg` pool:

```typescript
// src/lib/prisma.ts (již implementováno)
const pool = new Pool({
  connectionString,
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

### Query Optimization

**Použij `select` místo načítání všech sloupců:**
```typescript
// Špatně
const bookings = await prisma.booking.findMany()

// Správně
const bookings = await prisma.booking.findMany({
  select: {
    id: true,
    customerName: true,
    appointmentDate: true
  }
})
```

**Použij `include` místo N+1 queries:**
```typescript
// Špatně (N+1)
const bookings = await prisma.booking.findMany()
for (const booking of bookings) {
  const service = await prisma.service.findUnique({
    where: { id: booking.serviceId }
  })
}

// Správně
const bookings = await prisma.booking.findMany({
  include: { service: true }
})
```

---

## Monitoring & Maintenance

### Database Size
```sql
SELECT
  pg_size_pretty(pg_database_size('ordinace_dental')) as db_size;
```

### Table Sizes
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Slow Queries
```sql
-- Enable logging (postgresql.conf)
log_min_duration_statement = 100  -- Log queries > 100ms

-- Nebo runtime:
SET log_min_duration_statement = 100;

-- Analyze query
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE appointmentDate > NOW();
```

### Vacuum & Analyze
```bash
# Pravidelná údržba (automatická, ale můžeš spustit manuálně)
psql $DATABASE_URL -c "VACUUM ANALYZE;"
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Database Migration

on:
  push:
    branches: [main]
    paths:
      - 'prisma/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npm run db:generate

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: Verify migration
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          psql $DATABASE_URL -c "SELECT COUNT(*) FROM services;"
```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Connection Pooling Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Last Updated:** 2026-02-01
**Prisma Version:** 7.x
**Database:** PostgreSQL
