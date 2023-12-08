import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ClassesModule } from 'src/modules/classes/classes.module';
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
  ],
})
export class AppModule {}
