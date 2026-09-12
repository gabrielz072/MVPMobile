import { getAnalytics, isSupported } from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDkQEiBuGe1vtNaEknGnDcOzVSa1KuqFdQ',
  authDomain: 'mvpmobile.firebaseapp.com',
  projectId: 'mvpmobile',
  storageBucket: 'mvpmobile.firebasestorage.app',
  messagingSenderId: '505651325318',
  appId: '1:505651325318:web:a0597346cb229e37a86407',
  measurementId: 'G-RK7DQ6VVX5',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (Platform.OS === 'web') {
  void isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}