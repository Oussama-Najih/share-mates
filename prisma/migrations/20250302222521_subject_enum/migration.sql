/*
  Warnings:

  - Changed the type of `subject` on the `ImagePost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('ANGLAIS', 'COMPTABILITE_GENERALE', 'BASES_DE_DONNEES', 'ELECTRONIQUE_ANALOGIQUE_2', 'TEC_2', 'ANALYSE_4', 'PROGRAMMATION_WEB', 'INFORMATIQUE_INDUSTRIELLE', 'PROGRAMMATION_AVANCEE_STRUCTURE_DONNEES_2', 'STATISTIQUE', 'SYSTEMES_EXPLOITATION_2', 'TP_ELECTRONIQUE_ANALOGIQUE_2', 'TP_PROGRAMMATION_AVANCEE_STRUCTURE_DONNEES_2', 'TP_INFORMATIQUE_INDUSTRIELLE');

-- AlterTable
ALTER TABLE "ImagePost" DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;
