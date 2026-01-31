/*
  Warnings:

  - You are about to drop the column `lastMessageAt` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."GroupChat" ADD COLUMN     "lastMessageAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "lastMessageAt";
