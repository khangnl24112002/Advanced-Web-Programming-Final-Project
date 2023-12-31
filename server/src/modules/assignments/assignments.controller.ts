import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDTO, MarkScoreStudentDto } from './dto/body.dto';
import {
  ASSIGNMENT_STATUS,
  createBufferFromExcelFile,
  readFileExcel,
} from 'src/utils';
import { CloudinaryService } from '../files/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from '../auth/auth.service';

@Controller('assignments')
@ApiTags('Assignments')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createAssignment(@Body() body: CreateAssignmentDTO) {
    const assignments = await this.assignmentsService.createAssignment(body);
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

  @Get()
  async getAllAssignments() {
    const assignments = await this.assignmentsService.getAllAssignments();
    return {
      status: true,
      data: assignments,
      message: 'Lấy danh sách bài tập thành công',
    };
  }

  @Get(':id/download-score')
  async downloadScoreForAssignment(@Param('id') id: number) {
    const grade = await this.assignmentsService.getAssignment(+id);
    const { studentAssignments, grades } = grade;
    const refactoredData = studentAssignments.map((studentAssignment) => {
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

  @Post(':id/mark-score')
  async markScoreForAssignment(
    @Param('id') id: number,
    @Body() body: MarkScoreStudentDto,
  ) {
    const { scores } = body;
    const refactoredScores = scores?.map((score) => ({
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
    return {
      status: true,
      data: excelData,
      message: 'Chấm điểm thành công',
    };
  }
}
