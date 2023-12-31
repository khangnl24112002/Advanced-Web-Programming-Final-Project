import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDTO, MarkScoreStudentDto } from './dto/body.dto';
import * as xlsx from 'xlsx';
import { ASSIGNMENT_STATUS, createBufferFromExcelFile } from 'src/utils';
import { CloudinaryService } from '../files/cloudinary.service';

@Controller('assignments')
@ApiTags('Assignments')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly cloudinaryService: CloudinaryService,
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
    const mockData = [
      {
        studentId: '1711060777',
        Grade: 10,
      },
      {
        studentId: '1711060777',
        Grade: 10,
      },
    ];
    const buffer = createBufferFromExcelFile(mockData, 'Grade');
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
    const refactoredScores = scores.map((score) => ({
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
}
