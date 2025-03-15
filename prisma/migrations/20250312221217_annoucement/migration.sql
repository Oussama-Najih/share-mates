/*
  Warnings:

  - You are about to drop the column `image` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "announcementId" UUID;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
