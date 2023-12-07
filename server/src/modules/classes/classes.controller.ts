import { Controller, Get, Post, Body, Param, Delete, InternalServerErrorException, BadRequestException, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CurrentUser } from 'src/decorators/users.decorator';

@Controller('classes')
export class ClassesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    try {
      const exClass = await this.classesService.findOne(createClassDto.name);
      if (exClass) {
        throw new BadRequestException({
          status: false,
          message: "Lớp học đã tồn tại"
        })
      }
      return this.classesService.create(createClassDto);
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        message: "Lỗi hệ thống"
      });
    }
  }

  @Get()
  findAll(@CurrentUser('id') teacherId: string) {
    return this.classesService.findAll(teacherId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.classesService.findClassById(+id);
  }


}
