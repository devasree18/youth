# YOUTH Platform — Disaster Recovery & Backup Plan

## Backup & Point-in-Time Recovery Strategy

1. **Automated Continuous Backups:**
   - MongoDB Atlas automated continuous backups with 7-day point-in-time recovery (PITR).
2. **Weekly Snapshot Archival:**
   - Encrypted snapshot backups stored in isolated cloud storage buckets.
3. **Disaster Recovery Target Time:**
   - Recovery Point Objective (RPO): < 5 minutes.
   - Recovery Time Objective (RTO): < 1 hour.
