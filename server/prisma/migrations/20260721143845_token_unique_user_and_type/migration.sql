/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Token_userId_type_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_type_key" ON "public"."Token"("userId", "type");
