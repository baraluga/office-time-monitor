import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as checkIn from './check-in.handler';
import * as checkOut from './check-out.handler';
import { doNothing } from './app-references';

// Initialize RTDB
admin.initializeApp();

export const checkin = functions.https.onRequest(checkIn.handler);
export const checkout = functions.https.onRequest(checkOut.handler);
export const _monthlyCutoff = functions.pubsub.schedule('').onRun(() => doNothing());
