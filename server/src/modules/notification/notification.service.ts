import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as config from './firebase.config.json';
@Injectable()
export class NotificationService {
  private __firebase: any;
  constructor() {
    this.__firebase =
      firebase.apps.length === 0
        ? firebase.initializeApp({
            credential: firebase.credential.cert({
              projectId: config.project_id,
              clientEmail: config.client_email,
              privateKey: config.private_key,
            }),
            databaseURL:
              'https://webfinalproject-ef3ea-default-rtdb.firebaseio.com',
          })
        : firebase.apps[0];
  }
  async createNotification() {
    return 'This action adds a new notification';
  }

  public async readNotiLengthFromDB(userId: string) {
    return this.__firebase
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
    const ref = this.__firebase.database().ref('notifications');
    if (!currentNotiLength) {
      return ref.child(userId).set({ '0': newData });
    }
    const newKeyRef = ref
      .child(userId)
      .child(currentNotiLength.toString())
      .set(newData);
    return newKeyRef;
  }
}
