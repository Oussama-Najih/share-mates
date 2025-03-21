/*
  Warnings:

  - Made the column `original_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "original_name" SET NOT NULL;
