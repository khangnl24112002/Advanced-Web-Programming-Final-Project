/*
  Warnings:

  - You are about to drop the column `usersId` on the `classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_usersId_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "usersId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;
