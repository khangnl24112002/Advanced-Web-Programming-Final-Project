/*
  Warnings:

  - A unique constraint covering the columns `[unique_code]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "unique_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "classes_unique_code_key" ON "classes"("unique_code");
