/*
  Warnings:

  - A unique constraint covering the columns `[userId,notificationType,entityId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Notification_userId_notificationType_entityId_senderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_notificationType_entityId_key" ON "public"."Notification"("userId", "notificationType", "entityId");
