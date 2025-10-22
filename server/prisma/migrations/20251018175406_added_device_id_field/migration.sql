/*
  Warnings:

  - Added the required column `deviceId` to the `LoginSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LoginSession" ADD COLUMN     "deviceId" TEXT NOT NULL;
