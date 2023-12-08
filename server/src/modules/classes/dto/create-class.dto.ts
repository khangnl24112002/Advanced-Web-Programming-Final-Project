import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({})
  @IsString()
  @ApiProperty({ example: 'Lớp 1' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 50 })
  maximumStudents: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Mô tả lớp học' })
  description: string;
}
