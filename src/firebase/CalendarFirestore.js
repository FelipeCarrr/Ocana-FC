import app from "./app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app);

export const saveEvent = async (name, years, rol, category, day, month) => {
  const docRef = await addDoc(collection(db, "events"), {
    name,
    years,
    rol,
    category,
    day,
    month,
    createdAt: new Date(),
  });
  return docRef;
};

export const getAllEvents = async () => {
  const querySnapshot = await getDocs(collection(db, "events"));
  const eventsList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return eventsList.length ? eventsList : [];
};

export const getEvent = async (refDoc) => {
  const docRef = doc(db, "events", refDoc);
  const docSnap = await getDoc(docRef);
  return docSnap;
};
