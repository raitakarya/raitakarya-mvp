-- Add performance indexes for geospatial queries and common lookups

-- WorkerProfile: Index for location-based worker search
CREATE INDEX "WorkerProfile_latitude_longitude_idx" ON "WorkerProfile"("latitude", "longitude");

-- Job: Index for location-based job search
CREATE INDEX "Job_latitude_longitude_idx" ON "Job"("latitude", "longitude");

-- Job: Composite index for dashboard queries (status + startDate)
CREATE INDEX "Job_status_startDate_idx" ON "Job"("status", "startDate");

-- Job: Index for sorting by creation date
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- Job: Add onDelete CASCADE for farmer deletion (prevent orphaned jobs)
-- Note: This requires dropping and recreating the foreign key constraint
ALTER TABLE "Job" DROP CONSTRAINT "Job_farmerId_fkey";
ALTER TABLE "Job" ADD CONSTRAINT "Job_farmerId_fkey"
  FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
