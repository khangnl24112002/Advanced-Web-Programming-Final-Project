import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { PrismaService } from 'src/prisma.service';
import { map } from 'lodash';

@Injectable()
export class ClassesService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly prismaService: PrismaService
  ) {}
  async create(createClassDto: CreateClassDto) {
    return this.prismaService.classes.create({
      data: createClassDto,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })
  }

  async findAll(userId: string) {
    return this.prismaService.classes.findMany({
      where: {
        classStudents: {
          some: {
            studentId: userId,
            isDisabled: false,
          }
        }
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })
  }

  async findOne(name: string) {
    return this.prismaService.classes.findFirst({
      where: {
        name: name,
        isDisabled: false,
      },
    })
  }
  async findClassById(id: number) {
    return this.prismaService.classes.findUnique({
      where: {
        id: id,
        isDisabled: false,
      },
    })
  }

  async getAllClassesOfTeacher(teacherId: string) {
    return this.prismaService.classes.findMany({
      where: {
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })
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
          },
          where: {
            isDisabled: false,
            emailVerified: true,
          }
        },
      }
    })
    return map(students, 'students')
  }

  async inviteStudentToClass(classId: number, studentId: string) {
    return this.prismaService.classStudents.create({
      data: {
        classId,
        studentId,
      }
    })
  }
}
