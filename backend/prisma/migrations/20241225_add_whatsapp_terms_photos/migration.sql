-- AlterTable
ALTER TABLE "User" ADD COLUMN "whatsappNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "acceptedTermsAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Job" ADD COLUMN "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
