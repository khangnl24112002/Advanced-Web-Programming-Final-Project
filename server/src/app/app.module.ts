import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssignmentsModule } from 'src/modules/assignments/assignments.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ClassesModule } from 'src/modules/classes/classes.module';
import { CloudinaryModule } from 'src/modules/files/cloudinary.module';
import { WebSocketModule } from 'src/modules/socket/websocket.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    WebSocketModule,
    ClassesModule,
    AssignmentsModule,
    CloudinaryModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
