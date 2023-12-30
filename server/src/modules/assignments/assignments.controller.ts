import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDTO } from './dto/body.dto';

@Controller('assignments')
@ApiTags('Assignments')
export class AssignmentsController {
    constructor(
        // eslint-disable-next-line prettier/prettier
        private readonly assignmentsService: AssignmentsService,
    ) { }

    @Post()
    async createAssignment(
        @Body() body: CreateAssignmentDTO,
    ) {
        const assignments = await this.assignmentsService.createAssignment(body);
        return {
            status: true,
            data: assignments,
            message: "Tạo bài tập thành công"
        }
    }

    @Put(':id')
    async updateAssignment(
        @Body() body: CreateAssignmentDTO,
        @Param('id') id: number,
    ) {
        const assignments = await this.assignmentsService.updateAssignment(+id, body);
        return {
            status: true,
            data: assignments,
            message: "Cập nhật bài tập thành công"
        }
    }

    @Get()
    async getAllAssignments() {
        const assignments = await this.assignmentsService.getAllAssignments();
        return {
            status: true,
            data: assignments,
            message: "Lấy danh sách bài tập thành công"
        }
    }

}
