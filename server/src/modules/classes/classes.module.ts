import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, PrismaService, AuthService],
})
export class ClassesModule {}
