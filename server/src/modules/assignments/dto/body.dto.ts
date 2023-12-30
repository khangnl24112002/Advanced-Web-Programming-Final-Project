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
