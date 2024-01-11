import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Lớp 1' })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 50 })
  maximumStudents: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Mô tả lớp học' })
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: true })
  isDisabled: string;
}
