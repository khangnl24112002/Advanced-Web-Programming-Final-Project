import {
  Controller,
  Get,
  Body,
  UseGuards,
  Put,
  Query,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUsersResponse } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { readFileExcel, removeDirectory } from 'src/utils';
import e from 'express';
import { map } from 'lodash';
import { AuthService } from '../auth/auth.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('Bearer')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: GetUsersResponse,
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    type: GetUsersResponse,
  })
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @Query('email') email: string) {
    return this.userService.update(email, updateUserDto);
  }

  @Post('update-studentId-file')
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
  @ApiOkResponse()
  async updateStudentIdFile(@UploadedFile() file: Express.Multer.File) {
    const excelData = await readFileExcel(file.path);
    await Promise.all(
      map(excelData, async (data) => {
        try {
          const { Email, StudentId }: any = data;
          const updated = await this.userService.update(Email, {
            uniqueId: StudentId.toString(),
          });
          return updated;
        } catch (e) {
          console.log(e);
        }
      }),
    );
    // await removeDirectory('./uploads');
    return {
      status: true,
      message: 'update studentId success',
    };
  }
}
