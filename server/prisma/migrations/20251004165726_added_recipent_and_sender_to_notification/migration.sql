-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "count" INTEGER DEFAULT 1,
ADD COLUMN     "redirectUrl" TEXT,
ADD COLUMN     "senderId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
