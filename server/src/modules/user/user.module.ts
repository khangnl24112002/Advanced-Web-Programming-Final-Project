import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
