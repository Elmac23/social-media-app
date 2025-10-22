/*
  Warnings:

  - You are about to drop the column `count` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,notificationType,entityId,senderId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Notification_userId_notificationType_entityId_key";

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "count";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_notificationType_entityId_senderId_key" ON "public"."Notification"("userId", "notificationType", "entityId", "senderId");
