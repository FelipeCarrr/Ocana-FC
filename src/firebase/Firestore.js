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
} from "firebase/firestore";
import { deletedFrontPage } from "./Storage.js";

const db = getFirestore(app);

export const saveNews = async (
  title,
  description,
  URL,
  frontPage,
  frontPageRef,
) => {
  const docRef = await addDoc(collection(db, "noticia"), {
    title: title,
    description: description,
    URL: URL,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
  });
};

export const updateNews  = async (
  id,
  title,
  description,
  URL,
  frontPage,
  frontPageRef,
) => {
  const docRef = doc(db, "noticia", id);
  await updateDoc(docRef, {
    title: title,
    description: description,
    URL: URL,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
  });
};

export const deleteNews = async (document) => {
  await deleteDoc(doc(db, "noticia", document.id));
  await deletedFrontPage(document.data().frontPageRef);
};

export const getAllNoticias = async () => {
  const querySnapshot = await getDocs(collection(db, "noticia"));
  return querySnapshot;
};

export const getNoticia = async (refDoc) => {
  const docRef = doc(db, "noticia", refDoc);
  const docSnap = await getDoc(docRef);
  return docSnap;
};
