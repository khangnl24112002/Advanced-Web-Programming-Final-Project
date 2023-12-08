import { Controller, Get, Post, Body, Param,  InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CurrentUser } from 'src/decorators/users.decorator';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateClassResponse, GetStudentClassResponse, GetStudentInClassResponse, GetTeacherClassResponse } from './dto/response';

@Controller('classes')
export class ClassesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiCreatedResponse({type: CreateClassResponse})
  async create(@Body() createClassDto: CreateClassDto) {
    const exClass = await this.classesService.findOne(createClassDto.name);
      if (exClass) {
        throw new BadRequestException({
          status: false,
          message: "Lớp học đã tồn tại"
        })
      }
      const classCreated = await this.classesService.create(createClassDto);
      const classResponse = await this.classesService.findClassById(classCreated.id);
      return {
        status: true,
        data: classResponse,
        message: "Tạo lớp học thành công"
      }
  }

  @Get('student')
  @ApiOkResponse({type: GetStudentClassResponse})
  async findAll(@CurrentUser('id') userId: string) {

    try {
      const classes = await this.classesService.findAll(userId);

      return {
        status: true,
        data: classes,
        message: "Lấy danh sách lớp học thành công"
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        message: "Lỗi hệ thống"
      });
    }
  }

  @Get('teacher')
  @ApiOkResponse({type: GetTeacherClassResponse})
  async getAllClassesOfTeacher(@CurrentUser('id') teacherId: string) {
    try {
      const classes = await this.classesService.getAllClassesOfTeacher(teacherId);
      return {
        status: true,
        data: classes,
        message: "Lấy danh sách lớp học thành công"
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        message: "Lỗi hệ thống"
      });
    }
  }

  @Get(':id')
  @ApiOkResponse({type: CreateClassResponse})
  async findOne(@Param('id') id: number) {
    const classResponse = await this.classesService.findClassById(+id);
      if (!classResponse) {
        throw new BadRequestException({
          status: false,
          message: "Lớp học không tồn tại"
        })
      }
      return {
        status: true,
        data: classResponse,
        message: "Lấy thông tin lớp học thành công"
      }
    
  }

  @Get(':id/students')
  @ApiOkResponse({type: GetStudentInClassResponse})
  async getStudentsOfClass(@Param('id') id: string) {
    try {
      const students = await this.classesService.getStudentsOfClass(+id);
      return {
        status: true,
        data: students,
        message: "Lấy danh sách học sinh thành công"
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        message: "Lỗi hệ thống"
      });
    }
  }

  @Get(':id/invite/:studentId')
  @ApiOkResponse({type: CreateClassResponse})
  async inviteStudentToClass(@Param('id') id: string, @Param('studentId') studentId: string) {
    await this.classesService.inviteStudentToClass(+id, studentId);
    return {
      status: true,
      message: "Mời học sinh vào lớp thành công",
      data: null
    }
  }
}
