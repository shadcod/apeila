import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, 'products'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    // تنظيف بيانات الألوان
    const cleanColors = Array.isArray(data.colors)
      ? data.colors.map(color => {
          if (typeof color === 'string') {
            // إذا اللون فقط رابط صورة، حوله لكائن كامل
            return {
              name: '',
              code: '#000000',
              image: color,
            };
          }
          // إذا هو كائن، تأكد من وجود الخصائص مع قيم إفتراضية
          return {
            name: color.name || '',
            code: color.code || '#000000',
            image: color.image || '',
          };
        })
      : [];

    return {
      id: doc.id,              // معرف المستند في فايربيس
      internalId: data.id,     // معرف داخلي (إن وجد)
      ...data,
      colors: cleanColors,     // استبدل colors بالنسخة النظيفة
    };
  });
}
