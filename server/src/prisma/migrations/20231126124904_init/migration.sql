-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "email_verified_at" TIMESTAMP(3);
