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
import app from "./app";
import { deletedFrontPage } from "./StorageStream.js";

const db = getFirestore(app);

export const saveStream = async (URL, frontPage, frontPageRef, isLive) => {
  await addDoc(collection(db, "liveStreams"), {
    URL,
    frontPage,
    frontPageRef,
    isLive,
    createdAt: new Date(),
  });
};

export const updateLiveStream = async (id, URL, frontPage, frontPageRef, isLive) => {
  const docRef = doc(db, "liveStreams", id);
  await updateDoc(docRef, {
    URL,
    frontPage,
    frontPageRef,
    isLive,
  });
};

export const deleteLiveStream = async (document) => {
  try {
    const docRef = doc(db, "liveStreams", document.id);
    await deleteDoc(docRef);

    // Elimina la imagen de portada asociada
    const frontPageRef = document.data().frontPageRef;
    if (frontPageRef) {
      await deletedFrontPage(frontPageRef);
    }
  } catch (error) {
    throw new Error(`Error deleting live stream: ${error.message}`);
  }
};

export const getAllLiveStreams = async () => {
  const q = query(collection(db, "liveStreams"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const getLiveStream = async (refDoc) => {
  const docRef = doc(db, "liveStreams", refDoc);
  const docSnap = await getDoc(docRef);

  return docSnap;
};
