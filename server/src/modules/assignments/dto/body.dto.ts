import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssignmentDTO {
  @ApiProperty({ required: true, example: 'Minh' })
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ required: true, example: 'Minh' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: '1' })
  gradeId: number;

  @ApiProperty({ required: true, example: 'description' })
  @IsOptional()
  description: string;

  @ApiProperty({ required: true, example: '2021-10-10' })
  @Transform(({ value }) => new Date(value).toISOString())
  dueDate: string;
}
export class UpdateAssignmentDTO {
  @ApiProperty({ required: true, example: 'Minh' })
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ required: true, example: 'Minh' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: '1' })
  gradeId: number;

  @ApiProperty({ required: true, example: 'description' })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: true, example: '2021-10-10' })
  @Transform(({ value }) => new Date(value).toISOString())
  dueDate?: string;

  @ApiProperty({ required: true, example: 'COMPLETE' })
  @IsOptional()
  status?: string;

  @ApiProperty({ required: true, example: 'true' })
  @IsOptional()
  isDisable?: boolean;
}

class CreateGrade {
  @ApiProperty({ required: true, example: 'CKI' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: 'Minh' })
  @IsNotEmpty()
  percentage: number;
}

export class CreateGradeDto {
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: [
      {
        name: 'CKI',
        percentage: 40,
      },
      {
        name: 'CKII',
        percentage: 60,
      },
    ],
  })
  grades: CreateGrade[];
}

class MarkScoreStudent {
  @ApiProperty({ required: true, example: '1711060777' })
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ required: true, example: 10 })
  @IsNotEmpty()
  score: number;
}

export class MarkScoreStudentDto {
  @ApiProperty({
    required: true,
    example: [
      {
        studentId: '1711060777',
        score: 10,
      },
      {
        studentId: '1711060777',
        score: 10,
      },
    ],
    type: [MarkScoreStudent],
  })
  @IsNotEmpty()
  scores: MarkScoreStudent[];
}

export class RequestedGradeViewDto {
  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  studentAssignmentId: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  expectedScore: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  comment: string;
}

export class UpdateRequestedGradeViewDto {
  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  actualScore: number;

  @ApiProperty({ required: false, example: 'ACCEPT' })
  @IsNotEmpty()
  status: string;

  @ApiProperty({ required: false, example: 10 })
  @IsNotEmpty()
  studentAssignmentId: number;
}

export class CreateConversationDto {
  @ApiProperty({ required: false, example: 'test' })
  @IsNotEmpty()
  message: string;
}
