/*
  Warnings:

  - Added the required column `type` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."GroupChatType" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "public"."GroupChat" ADD COLUMN     "type" "public"."GroupChatType" NOT NULL;
