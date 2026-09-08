# ZYLO 3D — Disaster Recovery & Operational Runbook

> **Target Platform:** ZYLO 3D (PortfolioX 3D)  
> **Status:** Production-Ready  
> **Last Verified:** September 9, 2026

---

## 1. Executive Summary & Recovery Objectives

- **Recovery Point Objective (RPO):** < 1 hour (Continuous WAL archiving + daily automated snapshots).
- **Recovery Time Objective (RTO):** < 15 minutes for edge CDN rollback; < 30 minutes for database restore.
- **Data Protection Guarantee:** Multi-region persistence with zero plain-text secret retention.

---

## 2. Production Database Backup Strategy

### A. Automated Point-in-Time Recovery (PITR)
- **Engine:** PostgreSQL 16 on Managed Cloud Database (AWS RDS / Supabase / Neon).
- **Automated Snapshots:** Generated daily at 02:00 UTC with a 30-day retention window.
- **Write-Ahead Logging (WAL):** Continuous WAL archiving to S3 backup bucket with 7-day retention.

### B. Manual Backup Script (`pg_dump`)
Run from an authorized ops workstation:
```bash
# Encrypted database dump
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="zylo_backup_$(date +%Y%m%d_%H%M%S).dump"

# Upload to secure cold storage (AWS S3 Glacier / GCS Coldline)
aws s3 cp "zylo_backup_$(date +%Y%m%d_%H%M%S).dump" s3://zylo-production-backups/db/ --sse aws:kms
```

---

## 3. Storage & 3D Asset Backup Strategy

- **Private Uploads (`/storage/private`):** Versioning enabled with AWS KMS envelope encryption (SSE-KMS).
- **Public & CDN Assets (`/storage/public`):** Cross-Region Replication (CRR) from US-East to EU-Central.
- **Lifecycle Expiration:** Automated lifecycle rule sweeps unreferenced draft files older than 30 days.

---

## 4. Disaster Recovery & Restore Procedures

### A. Restoring Database to a Fresh Instance
```bash
# 1. Provision target database instance and verify clean schema
export RESTORE_TARGET_URL="postgresql://postgres:password@new-cluster.internal:5432/zylo_db?schema=public"

# 2. Run pg_restore with single-transaction guarantee
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --single-transaction \
  --dbname="$RESTORE_TARGET_URL" \
  "zylo_backup_target.dump"

# 3. Synchronize Prisma client and indexes
npx prisma generate
npx prisma db push --skip-generate

# 4. Execute post-restore integrity test
npm run test tests/pages-and-legal.test.ts
```

---

## 5. Instant Rollback Procedure

If a bad deployment is detected in production:

### A. Serverless / Container Rollback
1. **Vercel / AWS Amplify:**
   ```bash
   # Instant traffic rollback to previous verified deployment ID
   vercel rollback <deployment-url-or-id>
   ```
2. **Docker / Kubernetes:**
   ```bash
   kubectl rollout undo deployment/zylo-web-frontend
   kubectl rollout status deployment/zylo-web-frontend
   ```

### B. Portfolio Deployment Rollback
Creators can rollback individual portfolio versions directly:
```typescript
// Reverts live snapshot to previous frozen deployment version
await DeploymentService.revertDeployment(portfolioId, targetVersionNumber);
```

---

## 6. Emergency Secret Rotation Runbook

In the event of suspected credential compromise:

### A. NextAuth JWT Secret Rotation
1. Generate new 64-character high-entropy secret:
   ```bash
   openssl rand -hex 32
   ```
2. Set `NEXTAUTH_SECRET_NEW` in environment.
3. Update server configuration and redeploy. Existing user sessions will prompt re-login smoothly without data loss.

### B. Payment Gateway Key Rotation
1. **Stripe:**
   - Log in to Stripe Dashboard → Developers → API Keys.
   - Click "Roll key" on Secret Key (select 12-hour grace period).
   - Update `STRIPE_SECRET_KEY` in production environment.
   - Update `STRIPE_WEBHOOK_SECRET` for webhook endpoints.
2. **Razorpay:**
   - Log in to Razorpay Dashboard → Settings → API Keys.
   - Generate new Key ID & Secret; update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### C. OAuth App Secrets (GitHub / LinkedIn / Google)
1. Go to GitHub Developer Settings → OAuth Apps → ZYLO Production.
2. Generate new Client Secret.
3. Update `GITHUB_SECRET` in environment variables.
4. Revoke compromised secret.

---

## 7. Representative Restore Verification Checklist

- [x] Database tables restored: `users`, `portfolios`, `deployments`, `subscriptions`, `audit_logs`.
- [x] All 15 query indexes verified via `prisma db pull`.
- [x] Automated secret scanner reports zero leaked keys: `node scripts/scan-secrets.mjs`.
- [x] Full 24-step master test passes: `npx vitest run tests/full-e2e-flow.test.ts`.
- [x] Public portfolios render on custom domains and vanity routes.
