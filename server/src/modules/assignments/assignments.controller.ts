import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import {
  CreateAssignmentDTO,
  MarkScoreStudentDto,
  RequestedGradeViewDto,
  StudentAssigmentDto,
  UpdateRequestedGradeViewDto,
} from './dto/body.dto';
import {
  ASSIGNMENT_STATUS,
  REQUESTED_REVIEW_STATUS,
  createBufferFromExcelFile,
  readFileExcel,
} from 'src/utils';
import { CloudinaryService } from '../files/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from '../auth/auth.service';
import { map } from 'lodash';
import { Prisma } from '@prisma/client';
import { CurrentUser } from 'src/decorators/users.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { NotificationService } from '../notification/notification.service';
import * as moment from 'moment';

@Controller('assignments')
@ApiTags('Assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get(':id')
  async getAssignment(@Param('id') id: number) {
    const assignment = await this.assignmentsService.getAssignment(+id);
    return {
      status: true,
      data: assignment,
      message: 'Lấy bài tập thành công',
    };
  }

  @Post()
  async createAssignment(
    @Body() body: CreateAssignmentDTO,
    @CurrentUser('id') teacherId: string,
  ) {
    const assignments = await this.assignmentsService.createAssignment({
      ...body,
      teacherId,
    });
    return {
      status: true,
      data: assignments,
      message: 'Tạo bài tập thành công',
    };
  }

  @Put(':id')
  async updateAssignment(
    @Body() body: CreateAssignmentDTO,
    @Param('id') id: number,
  ) {
    const assignments = await this.assignmentsService.updateAssignment(
      +id,
      body,
    );
    return {
      status: true,
      data: assignments,
      message: 'Cập nhật bài tập thành công',
    };
  }

  @Get(':classId')
  async getAllAssignments(@Param('classId') classId: number) {
    const assignments =
      await this.assignmentsService.getAllAssignments(classId);
    return {
      status: true,
      data: assignments,
      message: 'Lấy danh sách bài tập thành công',
    };
  }

  @Get(':id/download-score')
  async downloadScoreForAssignment(@Param('id') id: number) {
    const grade = await this.assignmentsService.getAssignment(+id);
    if (!grade) {
      throw new HttpException(
        {
          status: false,
          message: 'Không tìm thấy bài tập',
        },
        404,
      );
    }
    const { studentAssignments } = grade;
    const refactoredData = map(studentAssignments, (studentAssignment) => {
      const { students } = studentAssignment;
      return {
        'Student Id': students?.uniqueId,
        'Full Name': students.firstName + ' ' + students.lastName,
        Grade: studentAssignment.score,
      };
    });
    const buffer = createBufferFromExcelFile(refactoredData, 'Grade');
    const uploadedFile = await this.cloudinaryService.uploadFile({
      buffer,
      filename: `Grade_${new Date().toISOString()}.xlsx`,
    });
    return {
      status: true,
      data: uploadedFile.url,
      message: 'Tải file Grade thành công',
    };
  }

  @Post('id:/student-assignment')
  async createStudentAssignment(
    @Body() body: StudentAssigmentDto,
    @Param('id') id: number,
  ) {
    const assignment = await this.assignmentsService.getAssignment(+id);
    if (!assignment) {
      throw new HttpException(
        {
          status: false,
          message: 'Không tìm thấy bài tập',
        },
        404,
      );
    }
    const status = moment().isBefore(assignment.dueDate)
      ? ASSIGNMENT_STATUS.SUBMITTED
      : ASSIGNMENT_STATUS.LATE;
    const { studentId, metadata } = body;
    const studentAssignment =
      await this.assignmentsService.createStudentAssignment({
        studentId,
        assignmentId: +id,
        metadata,
        status,
      });
    return {
      status: true,
      data: studentAssignment,
      message: 'Tải file Grade thành công',
    };
  }

  @Post(':id/mark-score')
  async markScoreForAssignment(
    @Param('id') id: number,
    @Body() body: MarkScoreStudentDto,
  ) {
    const { scores } = body;
    const refactoredScores = map(scores, (score) => ({
      ...score,
      assignmentId: +id,
      status: ASSIGNMENT_STATUS.GRADED,
    }));
    const assignments =
      await this.assignmentsService.markScoreForAssignment(refactoredScores);
    return {
      status: true,
      data: assignments,
      message: 'Chấm điểm thành công',
    };
  }

  @Post(':id/mark-score-excel')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async markScoreForAssignmentExcel(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const excelData = await readFileExcel(file.path);
    const students = await Promise.all(
      excelData.map(async (data: any) => {
        const { StudentId } = data;
        const student = await this.authService.getUserByUniqueId(StudentId);
        return {
          studentId: student.id,
          score: data.Grade,
          assignmentId: +id,
          status: ASSIGNMENT_STATUS.GRADED,
        };
      }),
    );
    const assignments =
      await this.assignmentsService.markScoreForAssignment(students);
    return {
      status: true,
      data: assignments,
      message: 'Chấm điểm thành công',
    };
  }

  @Get(':id/requested-grade-view')
  async getRequestedGradeView(@Param('id') id: number) {
    const requestedReviews =
      await this.assignmentsService.getRequestedGradeView(+id);
    const refactoredData = map(requestedReviews, (studentAssignment) => {
      const { students } = studentAssignment;
      return {
        studentId: students?.id,
        firstName: students?.firstName,
        lastName: students?.lastName,
        uniqueId: students?.uniqueId,
        expectedScore: studentAssignment.expectedScore,
        comment: studentAssignment.comment,
        status: studentAssignment.status,
        studentRequestedReviewId: studentAssignment.id,
      };
    });

    return {
      status: true,
      data: refactoredData,
      message: 'Lấy danh sách phúc khảo thành công',
    };
  }

  @Post(':id/requested-grade-view')
  async requestedGradeView(
    @Param('id') id: number,
    @Body() body: RequestedGradeViewDto,
  ) {
    const { studentId, expectedScore, studentAssignmentId, comment } = body;
    const inputData: Prisma.studentRequestedReviewsUncheckedCreateInput = {
      assignmentId: +id,
      studentId,
      expectedScore,
      comment,
      status: REQUESTED_REVIEW_STATUS.OPENED,
    };
    const requestedGradeView =
      await this.assignmentsService.createRequestedGradeView(inputData);
    // UPDATE STATUS OF STUDENT ASSIGNMENT
    await this.assignmentsService.updateStudentAssignment(
      +studentAssignmentId,
      {
        status: ASSIGNMENT_STATUS.REQUESTED_REVIEW,
      },
    );
    return {
      status: true,
      data: requestedGradeView,
      message: 'Tải file Grade thành công',
    };
  }

  @Put('requested-grade-view/:studentRequestedReviewId')
  async updateRequestedGradeView(
    @Param('studentRequestedReviewId') studentRequestedReviewId: number,
    @Body() body: UpdateRequestedGradeViewDto,
  ) {
    const { actualScore, status, studentAssignmentId } = body;
    const prepareData: Prisma.studentRequestedReviewsUncheckedUpdateInput = {
      actualScore,
      status,
    };
    const requestedGradeView =
      await this.assignmentsService.updateRequestedGradeView(
        +studentRequestedReviewId,
        prepareData,
      );
    // update status of student assignment
    await this.assignmentsService.updateStudentAssignment(
      +studentAssignmentId,
      {
        status: ASSIGNMENT_STATUS.DONE_REQUESTED_REVIEW,
        score: actualScore,
      },
    );
    return {
      status: true,
      data: requestedGradeView,
      message: 'Tải file Grade thành công',
    };
  }

  @Post(':id/requested-grade-view/:studentRequestedReviewId/conversation')
  async createConversation(
    @Param('studentRequestedReviewId') studentRequestedReviewId: number,
    @Body() body: any,
    @CurrentUser('id') userId: string,
    @Param('id') id: number,
  ) {
    const { message } = body;
    const assignment = await this.assignmentsService.getAssignment(+id);
    if (!assignment) {
      throw new HttpException(
        {
          status: false,
          message: 'Không tìm thấy bài tập',
        },
        404,
      );
    }
    const requestedGradeViewDetail =
      await this.assignmentsService.getRequestGradeViewDetail(
        +studentRequestedReviewId,
      );
    if (!requestedGradeViewDetail) {
      throw new HttpException(
        {
          status: false,
          message: 'Không tìm thấy phúc khảo',
        },
        404,
      );
    }
    const { students } = requestedGradeViewDetail;
    const { teacher } = assignment;
    if (students.id === userId) {
      const userId = teacher.id;
      const notiLength =
        await this.notificationService.readNotiLengthFromDB(userId);
      const id = notiLength ? notiLength + 1 : 0;
      const payload = {
        content: `Sinh viên ${
          students?.firstName + '' + students?.lastName
        } vừa phản hồi trong cuộc hội thoại phúc khảo bài tập ${
          assignment.name
        }`,
        createdAt: new Date().toISOString(),
        isRead: false,
        title: 'Bạn vừa nhận được thông báo trong đoạn hội thoại',
        type: 'review',
      };
      await this.notificationService.saveNewNotiToUser({
        userId,
        currentNotiLength: notiLength || 0,
        newData: {
          ...payload,
          id,
        },
      });
    } else {
      const userId = students.id;
      const notiLength =
        await this.notificationService.readNotiLengthFromDB(userId);
      const id = notiLength ? notiLength + 1 : 0;
      const payload = {
        content: `Giáo viên ${
          teacher?.firstName + '' + teacher?.lastName
        } vừa phản hồi trong cuộc hội thoại phúc khảo bài tập ${
          assignment.name
        }`,
        createdAt: new Date().toISOString(),
        isRead: false,
        title: 'Bạn vừa nhận được thông báo trong đoạn hội thoại',
        type: 'review',
      };
      await this.notificationService.saveNewNotiToUser({
        userId,
        currentNotiLength: notiLength || 0,
        newData: {
          ...payload,
          id,
        },
      });
    }
    const requestedGradeView = await this.assignmentsService.createConversation(
      +studentRequestedReviewId,
      {
        message,
        userId,
      },
    );
    return {
      status: true,
      data: requestedGradeView,
      message: 'Tải file Grade thành công',
    };
  }
  @Get('requested-grade-view/:studentRequestedReviewId/conversation')
  async getConversation(
    @Param('studentRequestedReviewId') studentRequestedReviewId: number,
  ) {
    const requestedGradeView = await this.assignmentsService.getConversation(
      +studentRequestedReviewId,
    );
    return {
      status: true,
      data: map(requestedGradeView, ({ users, ...conversation }) => ({
        ...conversation,
        user: users?.firstName + ' ' + users?.lastName,
      })),
      message: 'Tải file Grade thành công',
    };
  }
}
