/*
  Warnings:

  - The values [PROGRAMMATION_AVANCEE_STRUCTURE_DONNEES_2,TP_PROGRAMMATION_AVANCEE_STRUCTURE_DONNEES_2] on the enum `Subject` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `categorie` to the `ImagePost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('PHOTOS', 'EXAMENS', 'CONTROLES', 'TDs', 'TPs');

-- AlterEnum
BEGIN;
CREATE TYPE "Subject_new" AS ENUM ('ANGLAIS', 'COMPTABILITE_GENERALE', 'BASES_DE_DONNEES', 'ELECTRONIQUE_ANALOGIQUE_2', 'TEC_2', 'ANALYSE_4', 'PROGRAMMATION_WEB', 'INFORMATIQUE_INDUSTRIELLE', 'STRUCTURE_DONNEES_2', 'STATISTIQUE', 'SYSTEMES_EXPLOITATION_2', 'TP_ELECTRONIQUE_ANALOGIQUE_2', 'TP_STRUCTURE_DONNEES_2', 'TP_INFORMATIQUE_INDUSTRIELLE');
ALTER TABLE "ImagePost" ALTER COLUMN "subject" TYPE "Subject_new" USING ("subject"::text::"Subject_new");
ALTER TYPE "Subject" RENAME TO "Subject_old";
ALTER TYPE "Subject_new" RENAME TO "Subject";
DROP TYPE "Subject_old";
COMMIT;

-- AlterTable
ALTER TABLE "ImagePost" ADD COLUMN     "categorie" "Categorie" NOT NULL;
