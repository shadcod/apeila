// scripts/importProducts.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvJnLYGiF3znucSGDzUyDuU1kpwMC0Tpk",
  authDomain: "apeila-86.firebaseapp.com",
  projectId: "apeila-86",
  storageBucket: "apeila-86.appspot.com",
  messagingSenderId: "608388981694",
  appId: "1:608388981694:web:b65d7d0d1da8659f950fef",
  measurementId: "G-0JDTHH83YR",
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// قراءة ملف JSON
const rawData = fs.readFileSync("public/data/products.json");
const products = JSON.parse(rawData);

async function importProducts() {
  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
      console.log(`✅ تمت إضافة المنتج: ${product.name}`);
    }
    console.log("🎉 تم رفع جميع المنتجات بنجاح!");
    process.exit(0);
  } catch (error) {
    console.error("❌ حدث خطأ أثناء رفع المنتجات:", error);
    process.exit(1);
  }
}

importProducts();
