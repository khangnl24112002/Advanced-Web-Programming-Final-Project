import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import config from './firebase.config.json';

@Injectable()
export class NotificationService {
  constructor() {
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: config.project_id,
        clientEmail: config.client_email,
        privateKey: config.private_key,
      }),
      databaseURL:
        'https://clinus-1d1d1-default-rtdb.asia-southeast1.firebasedatabase.app',
    });
  }
  async createNotification() {
    return 'This action adds a new notification';
  }

  public async readNotiLengthFromDB(userId: string) {
    return firebase
      .database()
      .ref('notifications')
      .child(userId)
      .once('value')
      .then((snapshot) => {
        return snapshot.numChildren();
      })
      .catch((e) => {
        console.log('error from read', e);
      });
  }

  async saveNewNotiToUser({
    userId,
    currentNotiLength,
    newData,
  }: {
    userId: string;
    currentNotiLength: number;
    newData: any;
  }) {
    const ref = firebase.database().ref('notifications');
    if (!currentNotiLength) {
      return ref.child(userId).set({ '1': newData });
    }
    const newKeyRef = ref
      .child(userId)
      .child((currentNotiLength + 1).toString())
      .set(newData);
    return newKeyRef;
  }
}
