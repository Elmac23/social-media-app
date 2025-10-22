-- CreateEnum
CREATE TYPE "public"."PrivacyLevel" AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');

-- CreateTable
CREATE TABLE "public"."UserPrivacy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" "public"."PrivacyLevel" NOT NULL DEFAULT 'PRIVATE',
    "phoneNumber" "public"."PrivacyLevel" NOT NULL DEFAULT 'PRIVATE',
    "dateOfBirth" "public"."PrivacyLevel" NOT NULL DEFAULT 'PRIVATE',
    "friendsList" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "location" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "schools" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "jobs" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "hobbies" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "primaryLanguage" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',
    "otherLanguages" "public"."PrivacyLevel" NOT NULL DEFAULT 'FRIENDS',

    CONSTRAINT "UserPrivacy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivacy_userId_key" ON "public"."UserPrivacy"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserPrivacy" ADD CONSTRAINT "UserPrivacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
