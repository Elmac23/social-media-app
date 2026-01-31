/*
  Warnings:

  - You are about to drop the column `latestMessageId` on the `GroupChat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_groupChatId_fkey";

-- AlterTable
ALTER TABLE "public"."GroupChat" DROP COLUMN "latestMessageId";

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "public"."GroupChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
