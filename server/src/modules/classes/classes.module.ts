import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SendgridService } from '../mail/mail.service';
import { CloudinaryService } from '../files/cloudinary.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, PrismaService, AuthService, JwtService, SendgridService, CloudinaryService],
})
// eslint-disable-next-line prettier/prettier
export class ClassesModule { }
