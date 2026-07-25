-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "privacy" "public"."PrivacyLevel" NOT NULL DEFAULT 'PRIVATE';
