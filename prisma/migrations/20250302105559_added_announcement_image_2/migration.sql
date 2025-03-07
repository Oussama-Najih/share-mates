/*
  Warnings:

  - You are about to drop the column `title` on the `Announcement` table. All the data in the column will be lost.
  - Made the column `image` on table `Announcement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "title",
ALTER COLUMN "image" SET NOT NULL;
