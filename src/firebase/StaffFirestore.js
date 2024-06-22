import app from "./app.js";
import { auth } from "./Auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { deletedFrontPage } from "./StorageStaff.js";

const db = getFirestore(app);

export const saveStaff = async (nombre, cargo, frontPage, frontPageRef) => {
  const docRef = await addDoc(collection(db, "staff"), {
    nombre: nombre,
    cargo: cargo,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
    createdAt: new Date(),
  });
};

export const updateStaff = async (
  id,
  nombre,
  cargo,
  frontPage,
  frontPageRef
) => {
  const docRef = doc(db, "staff", id);
  await updateDoc(docRef, {
    nombre: nombre,
    cargo: cargo,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
  });
};

export const deleteStaff = async (document) => {
  await deleteDoc(doc(db, "staff", document.id));
  await deletedFrontPage(document.data().frontPageRef);
};

export const getAllStaff = async () => {
  const q = query(collection(db, "staff"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const getStaff = async (refDoc) => {
  const docRef = doc(db, "staff", refDoc);
  const docSnap = await getDoc(docRef);
  return docSnap;
};
