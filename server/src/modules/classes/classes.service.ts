import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClassesService {
  constructor(
    // eslint-disable-next-line prettier/prettier
    private readonly prismaService: PrismaService
  ) {}
  async create(createClassDto: CreateClassDto) {
    return this.prismaService.classes.create({
      data: createClassDto
    })
  }

  async findAll(teacherId: string) {
    return this.prismaService.classes.findMany({
      where: {
        teacherId
      }
    })
  }

  findOne(name: string) {
    return this.prismaService.classes.findFirst({
      where: {
        name: name,
      },
    })
  }
  async findClassById(id: number) {
    return this.prismaService.classes.findUnique({
      where: {
        id: id,
      },
    })
  }
}
