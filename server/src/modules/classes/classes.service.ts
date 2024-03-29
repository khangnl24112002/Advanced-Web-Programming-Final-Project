import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { map } from 'lodash';
import { ROLES } from 'src/utils';
import { CreateGradeDto } from '../assignments/dto/body.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly prismaService: PrismaService,
  ) {}

  async getAllClasses() {
    const exClasses = await this.prismaService.classes.findMany({
      include: {
        classTeachers: {
          select: {
            teachers: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return map(exClasses, (exClass) => {
      const teachers = map(exClass.classTeachers, 'teachers');
      return {
        ...exClass,
        teachers,
        classTeachers: undefined,
      };
    });
  }

  async create(createClassDto) {
    return this.prismaService.classes.create({
      data: createClassDto,
    });
  }

  async checkTeacherInClass(classId: number, teacherId: string) {
    return this.prismaService.classTeachers.findFirst({
      where: {
        classId,
        teacherId,
      },
    });
  }

  async addTeacherToClass(
    classId: number,
    teacherId: string,
    isCreator: boolean = false,
  ) {
    return this.prismaService.classTeachers.create({
      data: {
        classId,
        teacherId,
        isCreator,
      },
    });
  }

  async findAll(userId: string) {
    const exClasses = await this.prismaService.classes.findMany({
      where: {
        classStudents: {
          some: {
            studentId: userId,
            isDisabled: false,
          },
        },
      },
      include: {
        classTeachers: {
          select: {
            teachers: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return map(exClasses, (exClass) => {
      const teachers = map(exClass.classTeachers, 'teachers');
      return {
        ...exClass,
        teachers,
        classTeachers: undefined,
      };
    });
  }

  async findOne(name: string) {
    return this.prismaService.classes.findFirst({
      where: {
        name: name,
        isDisabled: false,
      },
    });
  }
  async findClassById(id: number, notTakeAll: boolean = true) {
    const exClass = await this.prismaService.classes.findUnique({
      where: {
        id: id,
        ...(notTakeAll ? { isDisabled: false } : {}),
      },
      include: {
        classStudents: {
          select: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
          where: {
            isDisabled: false,
          },
        },
        classTeachers: {
          where: {
            isDisabled: false,
          },
          select: {
            teachers: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    if (!exClass) return null;
    const students = map(exClass.classStudents, 'students');
    const teachers = map(exClass.classTeachers, 'teachers');
    return {
      ...exClass,
      students,
      teachers,
      classStudents: undefined,
      classTeachers: undefined,
    };
  }

  async updateClass(id: number, updateClassDto) {
    return this.prismaService.classes.update({
      where: {
        id,
      },
      data: updateClassDto,
    });
  }
  async getAllClassesOfTeacher(teacherId: string) {
    const exClasses = await this.prismaService.classes.findMany({
      where: {
        classTeachers: {
          some: {
            teacherId,
            isDisabled: false,
          },
        },
      },
      include: {
        classTeachers: {
          select: {
            teachers: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,

                email: true,
              },
            },
          },
        },
        classStudents: {
          select: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return map(exClasses, (exClass) => {
      const teachers = map(exClass.classTeachers, 'teachers');
      const students = map(exClass.classStudents, 'students');
      return {
        ...exClass,
        teachers,
        students,
        classTeachers: undefined,
        classStudents: undefined,
      };
    });
  }

  async getStudentsOfClass(classId: number) {
    const students = await this.prismaService.classStudents.findMany({
      where: {
        classId,
      },
      include: {
        students: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            uniqueId: true,
          },
          where: {
            isDisabled: false,
            emailVerified: true,
          },
        },
      },
    });
    return map(students, 'students');
  }

  async inviteStudentToClass(classId: number, studentId: string) {
    return this.prismaService.classStudents.create({
      data: {
        classId,
        studentId,
      },
    });
  }

  async inviteTeacherToClass(classId: number, teacherId: string) {
    return this.prismaService.classTeachers.create({
      data: {
        classId,
        teacherId,
      },
    });
  }

  async findClassByCodeId(uniqueCode: string) {
    return this.prismaService.classes.findUnique({
      where: {
        uniqueCode,
      },
    });
  }

  async findStudentOrTeacherInClass(
    classId: number,
    userId: string,
    roleId: number,
  ) {
    if (roleId === ROLES.TEACHER) {
      const teacher = await this.prismaService.classTeachers.findFirst({
        where: {
          classId,
          teacherId: userId,
        },
      });
      return teacher;
    }
    const student = await this.prismaService.classStudents.findFirst({
      where: {
        classId,
        studentId: userId,
      },
    });
    return student;
  }

  async inviteGroupUserToClass(classId: number, expiredAt: string) {
    return this.prismaService.classLinkInvitations.create({
      data: {
        classId,
        expiredAt,
      },
    });
  }

  async findInvitationById(id: string) {
    return this.prismaService.classLinkInvitations.findUnique({
      where: {
        id,
      },
    });
  }

  async findInvitationByClassId(classId: number) {
    return this.prismaService.classLinkInvitations.findFirst({
      where: {
        classId,
      },
    });
  }

  async deleteInvitations(classId: number) {
    return this.prismaService.classLinkInvitations.deleteMany({
      where: {
        classId,
      },
    });
  }

  async deleteInvitationById(id: string) {
    return this.prismaService.classLinkInvitations.delete({
      where: {
        id,
      },
    });
  }

  async deleteGrades(classId: number) {
    return this.prismaService.grades.deleteMany({
      where: {
        classId,
      },
    });
  }

  async createGrade(classId: number, createGradeDto: CreateGradeDto) {
    return Promise.all(
      createGradeDto.grades.map(async (grade) => {
        return this.prismaService.grades.create({
          data: {
            classId,
            name: grade.name,
            percentage: grade.percentage,
          },
        });
      }),
    );
  }

  async updateGrade(
    id: number,
    updateGradeDto: Prisma.gradesUncheckedUpdateInput,
  ) {
    return this.prismaService.grades.update({
      where: {
        id,
      },
      data: updateGradeDto,
    });
  }
  async getGrades(classId: number) {
    return this.prismaService.grades.findMany({
      where: {
        classId,
      },
      include: {
        assignments: {
          include: {
            studentAssignments: {
              select: {
                score: true,
                studentId: true,
                students: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    uniqueId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getTeachersOfClass(classId: number) {
    return this.prismaService.classTeachers.findMany({
      where: {
        classId,
      },
      include: {
        teachers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
    });
  }
}
