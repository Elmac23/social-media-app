-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('DEFAULT', 'SYSTEM_ADD_USER', 'SYSTEM_REMOVE_USER');

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "type" "public"."MessageType" NOT NULL DEFAULT 'DEFAULT';
