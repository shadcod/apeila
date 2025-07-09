import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
