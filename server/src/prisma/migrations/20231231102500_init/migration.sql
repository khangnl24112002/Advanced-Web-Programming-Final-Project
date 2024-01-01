-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "disabled_at" TIMESTAMP(3),
ADD COLUMN     "is_disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "status" TEXT DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "student_requested_review_conversation" (
    "id" SERIAL NOT NULL,
    "student_requested_id" INTEGER,
    "metadata" TEXT,
    "message" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_requested_review_conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_requested_review_conversation" ADD CONSTRAINT "student_requested_review_conversation_student_requested_id_fkey" FOREIGN KEY ("student_requested_id") REFERENCES "student_requested_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_requested_review_conversation" ADD CONSTRAINT "student_requested_review_conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
