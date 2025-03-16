/*
  Warnings:

  - The values [TP_ELECTRONIQUE_ANALOGIQUE_2,TP_STRUCTURE_DONNEES_2,TP_INFORMATIQUE_INDUSTRIELLE] on the enum `Subject` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Subject_new" AS ENUM ('ANGLAIS', 'COMPTABILITE_GENERALE', 'BASES_DE_DONNEES', 'ELECTRONIQUE_ANALOGIQUE_2', 'TEC_2', 'ANALYSE_4', 'PROGRAMMATION_WEB', 'INFORMATIQUE_INDUSTRIELLE', 'STRUCTURE_DONNEES_2', 'STATISTIQUE', 'SYSTEMES_EXPLOITATION_2');
ALTER TABLE "Post" ALTER COLUMN "subject" TYPE "Subject_new" USING ("subject"::text::"Subject_new");
ALTER TYPE "Subject" RENAME TO "Subject_old";
ALTER TYPE "Subject_new" RENAME TO "Subject";
DROP TYPE "Subject_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "LikeC" (
    "userId" UUID NOT NULL,
    "commentId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "LikeP" (
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LikeC_userId_commentId_key" ON "LikeC"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "LikeP_userId_postId_key" ON "LikeP"("userId", "postId");

-- AddForeignKey
ALTER TABLE "LikeC" ADD CONSTRAINT "LikeC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeC" ADD CONSTRAINT "LikeC_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeP" ADD CONSTRAINT "LikeP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeP" ADD CONSTRAINT "LikeP_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
