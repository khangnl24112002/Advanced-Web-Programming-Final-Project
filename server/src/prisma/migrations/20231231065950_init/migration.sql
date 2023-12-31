-- CreateTable
CREATE TABLE "student_requested_reviews" (
    "id" SERIAL NOT NULL,
    "student_assignment_id" INTEGER,
    "metadata" TEXT,
    "status" TEXT,
    "expected_score" DOUBLE PRECISION,
    "actual_score" DOUBLE PRECISION,
    "comment" TEXT,
    "assignment_id" INTEGER,
    "student_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_requested_reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_requested_reviews" ADD CONSTRAINT "student_requested_reviews_student_assignment_id_fkey" FOREIGN KEY ("student_assignment_id") REFERENCES "student_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_requested_reviews" ADD CONSTRAINT "student_requested_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_requested_reviews" ADD CONSTRAINT "student_requested_reviews_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
