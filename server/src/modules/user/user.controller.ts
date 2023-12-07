import { Controller, Get, Body, UseGuards, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetUsersResponse } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';


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
    return this.userService.update(email,updateUserDto);
  }

}
