// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDvJnLYGiF3znucSGDzUyDuU1kpwMC0Tpk",
  authDomain: "apeila-86.firebaseapp.com",
  projectId: "apeila-86",
  storageBucket: "apeila-86.appspot.com",
  messagingSenderId: "608388981694",
  appId: "1:608388981694:web:b65d7d0d1da8659f950fef",
  measurementId: "G-0JDTHH83YR",
};

// التأكد من تهيئة التطبيق مرة واحدة فقط
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// تهيئة التحليلات لكن فقط على المتصفح (client-side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
