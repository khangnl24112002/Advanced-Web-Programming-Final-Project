/*
  Warnings:

  - A unique constraint covering the columns `[grade_id]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "student_assignments" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "assignments_grade_id_key" ON "assignments"("grade_id");
