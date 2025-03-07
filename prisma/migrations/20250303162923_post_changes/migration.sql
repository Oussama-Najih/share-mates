/*
  Warnings:

  - You are about to drop the `ImagePost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImagePost" DROP CONSTRAINT "ImagePost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ImagePost" DROP CONSTRAINT "ImagePost_mediaId_fkey";

-- DropTable
DROP TABLE "ImagePost";

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject" "Subject" NOT NULL,
    "content" TEXT NOT NULL,
    "categorie" "Categorie" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" UUID NOT NULL,
    "mediaId" TEXT NOT NULL,
    "correction" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_mediaId_key" ON "Post"("mediaId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
