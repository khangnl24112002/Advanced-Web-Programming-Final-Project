import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async createNotification() {
    return 'This action adds a new notification';
  }
}
