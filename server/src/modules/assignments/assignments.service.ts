import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    return this.primsaService.studentAssignments.createMany({
      data,
    });
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
}
