import { ApiProperty } from '@nestjs/swagger';

export class CreateClassResponse {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Tạo lớp học thành công' })
  message: string;
  @ApiProperty({
    example: {
      id: 1,
      name: 'Lớp 1',
      maximumStudents: 50,
      teacher: {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'minh@email.com',
      },
    },
  })
  data: any;
}
export class GetStudentClassResponse {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Lấy danh sách lớp học thành công' })
  message: string;
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Lớp 1',
        maximumStudents: 50,
        teacher: {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'email@gmail.com',
        },
      },
    ],
  })
  data: any;
}
export class GetTeacherClassResponse {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Lấy danh sách lớp học thành công' })
  message: string;
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Lớp 1',
        maximumStudents: 50,
        teacher: {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'email@gmail.com',
        },
      },
    ],
  })
  data: any;
}

export class GetStudentInClassResponse {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Lấy danh sách học sinh thành công' })
  message: string;
  @ApiProperty({
    example: [
      {
        id: '1',
        firstName: 'Nguyễn Văn',
        lastName: 'A',
        email: 'email@gmail.com',
      },
    ],
  })
  data: any;
}

export class InviteStudentResponse {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Mời học sinh vào lớp thành công' })
  message: string;
}
