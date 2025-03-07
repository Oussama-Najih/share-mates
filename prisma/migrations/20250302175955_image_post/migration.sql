-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'PDF');

-- CreateTable
CREATE TABLE "ImagePost" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" UUID NOT NULL,
    "mediaId" TEXT NOT NULL,
    "correction" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ImagePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "imagePostId" TEXT,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImagePost_mediaId_key" ON "ImagePost"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imagePostId_key" ON "Media"("imagePostId");

-- AddForeignKey
ALTER TABLE "ImagePost" ADD CONSTRAINT "ImagePost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagePost" ADD CONSTRAINT "ImagePost_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
