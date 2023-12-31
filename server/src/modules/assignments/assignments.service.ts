import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compact, map } from 'lodash';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssignmentsService {
  // eslint-disable-next-line prettier/prettier
  constructor(readonly primsaService: PrismaService) {}
  async createAssignment(data: Prisma.assignmentsUncheckedCreateInput) {
    return this.primsaService.assignments.create({
      data,
    });
  }

  async updateAssignment(
    id: number,
    data: Prisma.assignmentsUncheckedUpdateInput,
  ) {
    return this.primsaService.assignments.update({
      where: { id },
      data,
    });
  }

  async updateStudentAssignment(
    id: number,
    data: Prisma.studentAssignmentsUncheckedUpdateInput,
  ) {
    return this.primsaService.studentAssignments.update({
      where: { id },
      data,
    });
  }

  async getAllAssignments() {
    return this.primsaService.assignments.findMany({
      include: {
        classes: true,
        grades: true,
        studentAssignments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markScoreForAssignment(
    data: Prisma.studentAssignmentsUncheckedCreateInput[],
  ) {
    return compact(
      await Promise.all(
        map(data, async (assignment) => {
          const { studentId, assignmentId } = assignment;
          const studentAssignment =
            await this.primsaService.studentAssignments.findFirst({
              where: {
                studentId,
                assignmentId,
              },
            });
          if (studentAssignment) {
            return this.primsaService.studentAssignments.upsert({
              where: {
                id: studentAssignment.id,
              },
              create: assignment,
              update: assignment,
            });
          }
          return null;
        }),
      ),
    );
  }

  async getAssignment(id: number) {
    return this.primsaService.assignments.findUnique({
      where: { id },
      include: {
        classes: true,
        grades: true,
        studentAssignments: {
          include: {
            students: true,
          },
        },
      },
    });
  }

  async createRequestedGradeView(
    data: Prisma.studentRequestedReviewsUncheckedCreateInput,
  ) {
    return this.primsaService.studentRequestedReviews.create({
      data,
    });
  }
}
