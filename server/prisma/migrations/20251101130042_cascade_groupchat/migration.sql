-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_groupChatId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "public"."GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
