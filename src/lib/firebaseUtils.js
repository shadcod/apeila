import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export async function getProducts() {
  const productsCol = collection(db, "products");
  const productsSnapshot = await getDocs(productsCol);
  const productsList = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return productsList;
}
