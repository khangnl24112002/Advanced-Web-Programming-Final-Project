import { Controller, Get, Post, Body, Param, InternalServerErrorException, BadRequestException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CurrentUser } from 'src/decorators/users.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateClassResponse, GetStudentClassResponse, GetStudentInClassResponse, GetTeacherClassResponse, InviteGroupStudentResponse, InviteStudentResponse } from './dto/response';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { AuthService } from '../auth/auth.service';
import { MAIL_TEMPLATE_ID, ROLES } from 'src/utils';
import moment from 'moment';
import { SendgridService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import {customAlphabet}  from 'nanoid';


@Controller('classes')
@ApiTags('Classes')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly jwtService: JwtService, private readonly classesService: ClassesService, private readonly authService: AuthService, private readonly mailService: SendgridService) { }

  @Post()
  @ApiCreatedResponse({ type: CreateClassResponse })
  async create(@Body() createClassDto: CreateClassDto, @CurrentUser('id') teacherId: string) {
    const exClass = await this.classesService.findOne(createClassDto.name);
    const uniqueCode =
      customAlphabet(
        '1234567890abcdefghiklmnouwpqz',
        10
      )(8)
        .toUpperCase();
    if (exClass) {
      throw new BadRequestException({
        status: false,
        message: "Lớp học đã tồn tại"
      })
    }
    const classCreated = await this.classesService.create({ ...createClassDto, uniqueCode });
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
  async inviteStudentToClass(@Param('email') email: string) {
    const user = await this.authService.findUserVerifyEmail(email);
    if (!user) {
      throw new BadRequestException({
        status: false,
        message: "Email không tồn tại"
      })
    }
    const frontendUrl = process.env.FRONTEND_URL;
    const token = await this.authService.generateAccessToken({ id: user.id, email: user.email });
    const dynamic_template_data = {
      link: `${frontendUrl}/invite/${token}`,
    };
    const msg = this.mailService.messageSignUpGenerate(
      [email as string],
      MAIL_TEMPLATE_ID.REGISTER as string,
      dynamic_template_data,
    );
    await this.mailService.send(msg)
    return {
      status: true,
      message: "Mời thành công",
      data: null
    }
  }


  @Get(':id/accept-invite/:token')
  async acceptInvite(@Param('id') id: string, @Param('token') token: string) {
    const jwtSercret = process.env.SECRET_KEY;
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: jwtSercret,
    });
    if (!decoded) {
      throw new HttpException(
        {
          message: 'Lỗi xác thực',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate expired token
    const isTokenExpired = Date.now() >= decoded.exp * 1000;
    if (isTokenExpired) {
      throw new HttpException(
        {
          message: 'Đường dẫn đã hết hạn. Vui lòng thử lại sau',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.authService.findUserVerifyByUserId(decoded.id);
    if (!user) {
      throw new BadRequestException({
        status: false,
        message: "Tài khoản không tồn tại"
      })
    }
    const roleId = user.roleId;
    if (roleId === ROLES.STUDENT) {
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

  @Get(':id/group-invite')
  @ApiOkResponse({ type: InviteGroupStudentResponse })
  async inviteGroupUserToClass(@Param('id') id: number) {
    const exInvitation = await this.classesService.findInvitationByClassId(+id);
    const frontendUrl = process.env.FRONTEND_URL;
    if (exInvitation) {
      const expiredAt = exInvitation.expiredAt;
      if (moment().isBefore(expiredAt)) {
        const expiredAt = moment().add(30, 'days').toDate().toISOString();
        const invitationsLink = await this.classesService.inviteGroupUserToClass(+id, expiredAt);

        const link = `${frontendUrl}/group-invite/${invitationsLink.id}`;
        return {
          status: true,
          message: "Mời thành công",
          data: link
        }
      }
      const link = `${frontendUrl}/invite/${exInvitation.id}`;
      return {
        status: true,
        message: "Mời thành công",
        data: link
      }
    }
    const expiredAt = moment().add(30, 'days').toDate().toISOString();
    const invitationsLink = await this.classesService.inviteGroupUserToClass(+id, expiredAt);
    const link = `${frontendUrl}/invite/${invitationsLink.id}`;
    return {
      status: true,
      message: "Mời thành công",
      data: link
    }
  }

  @Get(':id/accept-group-invite/:invitationId/:userId')
  @ApiOkResponse({ type: InviteStudentResponse })
  async acceptGroupInvite(@Param('id') id: number, @Param('invitationId') invitationId: string, @Param('userId') userId: string) {
    const invitation = await this.classesService.findInvitationById(invitationId);
    if (!invitation) {
      throw new BadRequestException({
        status: false,
        message: "Mã mời không tồn tại"
      })
    }
    const expiredAt = invitation.expiredAt;
    if (moment().isAfter(expiredAt)) {
      throw new BadRequestException({
        status: false,
        message: "Mã mời đã hết hạn"
      })
    }
    const user = await this.authService.findUserVerifyByUserId(userId);
    if (!user) {
      throw new BadRequestException({
        status: false,
        message: "Tài khoản không tồn tại"
      })
    }
    const roleId = user.roleId;
    if (roleId === ROLES.STUDENT) {
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
