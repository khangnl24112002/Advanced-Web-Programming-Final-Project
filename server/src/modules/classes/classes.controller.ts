import { Controller, Get, Post, Body, Param, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CurrentUser } from 'src/decorators/users.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateClassResponse, GetStudentClassResponse, GetStudentInClassResponse, GetTeacherClassResponse, InviteGroupStudentResponse, InviteStudentResponse } from './dto/response';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { AuthService } from '../auth/auth.service';
import { ROLES } from 'src/utils';
import moment from 'moment';

@Controller('classes')
@ApiTags('Classes')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly classesService: ClassesService, private readonly authService: AuthService) { }

  @Post()
  @ApiCreatedResponse({ type: CreateClassResponse })
  async create(@Body() createClassDto: CreateClassDto, @CurrentUser('id') teacherId: string) {
    const exClass = await this.classesService.findOne(createClassDto.name);
    if (exClass) {
      throw new BadRequestException({
        status: false,
        message: "Lớp học đã tồn tại"
      })
    }
    const classCreated = await this.classesService.create(createClassDto);
    const isCreator = true;
    await this.classesService.addTeacherToClass(classCreated.id, teacherId, isCreator);
    const classResponse = await this.classesService.findClassById(classCreated.id);
    return {
      status: true,
      data: classResponse,
      message: "Tạo lớp học thành công"
    }
  }

  @Get('student')
  @ApiOkResponse({ type: GetStudentClassResponse })
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
  @ApiOkResponse({ type: GetTeacherClassResponse })
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
  @ApiOkResponse({ type: CreateClassResponse })
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
  @ApiOkResponse({ type: GetStudentInClassResponse })
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

  @Get(':id/invite/:email')
  @ApiOkResponse({ type: InviteStudentResponse })
  async inviteStudentToClass(@Param('id') id: string, @Param('email') email: string) {
    const user = await this.authService.findUserVerifyEmail(email);
    if(!user) {
      throw new BadRequestException({
        status: false,
        message: "Email không tồn tại"
      })
    }
    const roleId = user.roleId;
    if(roleId === ROLES.STUDENT) {
      await this.classesService.inviteStudentToClass(+id, user?.id);
    }
     else {
      await this.classesService.inviteTeacherToClass(+id, user?.id);
     }
    return {
      status: true,
      message: "Mời thành công",
      data: null
    }
  }

  @Get(':id/group-invite')
  @ApiOkResponse({ type: InviteGroupStudentResponse })
  async inviteGroupUserToClass(@Param('id') id: string) {
    const expiredAt = moment().add(30, 'days').toDate().toISOString();
    const invitationsLink = await this.classesService.inviteGroupUserToClass(+id,expiredAt);
    const frontendUrl = process.env.FRONTEND_URL;
    const link = `${frontendUrl}/invite/${invitationsLink.id}`;
    return {
      status: true,
      message: "Mời thành công",
      data: link
    }
  }

  @Get(':id/accept-invite/:invitationId/:userId')
  @ApiOkResponse({ type: InviteStudentResponse })
  async acceptInvite(@Param('id') id: string, @Param('invitationId') invitationId: string, @Param('userId') userId: string) {
    const invitation = await this.classesService.findInvitationById(invitationId);
    if (!invitation) {
      throw new BadRequestException({
        status: false,
        message: "Mã mời không tồn tại"
      })
    }
    const expiredAt = invitation.expiredAt;
    if(moment().isAfter(expiredAt)) {
      throw new BadRequestException({
        status: false,
        message: "Mã mời đã hết hạn"
      })
    }
    const user = await this.authService.findUserVerifyByUserId(userId);
    if(!user) {
      throw new BadRequestException({
        status: false,
        message: "Tài khoản không tồn tại"
      })
    }
    const roleId = user.roleId;
    if(roleId === ROLES.STUDENT) {
      await this.classesService.inviteStudentToClass(+id, user?.id);
    } else {
      await this.classesService.inviteTeacherToClass(+id, user?.id);
    }
    return {
      status: true,
      message: "Tham gia lớp thành công",
      data: null
    }
  }
}
