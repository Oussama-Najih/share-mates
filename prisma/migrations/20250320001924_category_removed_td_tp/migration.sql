/*
  Warnings:

  - The values [TDS,TPS] on the enum `Categorie` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categorie_new" AS ENUM ('COURS', 'EXAMENS', 'CONTROLES');
ALTER TABLE "Post" ALTER COLUMN "category" TYPE "Categorie_new" USING ("category"::text::"Categorie_new");
ALTER TYPE "Categorie" RENAME TO "Categorie_old";
ALTER TYPE "Categorie_new" RENAME TO "Categorie";
DROP TYPE "Categorie_old";
COMMIT;
