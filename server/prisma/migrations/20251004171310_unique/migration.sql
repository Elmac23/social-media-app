/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,entityId,senderId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_type_entityId_senderId_key" ON "public"."Notification"("userId", "type", "entityId", "senderId");
