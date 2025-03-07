/*
  Warnings:

  - The values [TDs,TPs] on the enum `Categorie` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imagePostId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categorie_new" AS ENUM ('PHOTOS', 'EXAMENS', 'CONTROLES', 'TDS', 'TPS');
ALTER TABLE "Post" ALTER COLUMN "category" TYPE "Categorie_new" USING ("category"::text::"Categorie_new");
ALTER TYPE "Categorie" RENAME TO "Categorie_old";
ALTER TYPE "Categorie_new" RENAME TO "Categorie";
DROP TYPE "Categorie_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_mediaId_fkey";

-- DropIndex
DROP INDEX "Media_imagePostId_key";

-- DropIndex
DROP INDEX "Post_mediaId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "imagePostId",
ADD COLUMN     "postId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mediaId";

-- CreateIndex
CREATE UNIQUE INDEX "Media_postId_key" ON "Media"("postId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
