import { Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('notification')
@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@CurrentUser('id') userId: string) {
    const payload = {
      content: 'This is a notification',
      createdAt: new Date().toISOString(),
      isRead: false,
      title: "You've got a new notification",
      type: 'notification',
    };
    const notiLength =
      await this.notificationService.readNotiLengthFromDB(userId);
    const id = notiLength ? notiLength + 1 : 0;
    const saveNewNotiToUser = await this.notificationService.saveNewNotiToUser({
      userId,
      currentNotiLength: notiLength || 0,
      newData: {
        ...payload,
        id,
      },
    });
    return saveNewNotiToUser;
  }
}
