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
  orderBy
} from "firebase/firestore";
import { deletedFrontPage } from "./StoragePlayers.js";

const db = getFirestore(app);

export const savePlayer = async (
  jugador,
  posicion,
  equipo,
  dateBirth,
  frontPage,
  frontPageRef
) => {
  const docRef = await addDoc(collection(db, "Player"), {
    jugador: jugador,
    posicion: posicion,
    equipo: equipo,
    dateBirth: dateBirth,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
    createdAt: new Date()
  });
};

export const updatePlayer = async (
  id,
  jugador,
  posicion,
  equipo,
  dateBirth,
  frontPage,
  frontPageRef
) => {
  const docRef = doc(db, "Player", id);
  await updateDoc(docRef, {
    jugador: jugador,
    posicion: posicion,
    equipo: equipo,
    dateBirth: dateBirth,
    frontPage: frontPage,
    frontPageRef: frontPageRef,
  });
};

export const deletePlayer = async (document) => {
  await deleteDoc(doc(db, "Player", document.id));
  await deletedFrontPage(document.data().frontPageRef);
};

export const getAllPlayers = async () => {
  const q = query(collection(db, "Player"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const getPlayer = async (refDoc) => {
  const docRef = doc(db, "Player", refDoc);
  const docSnap = await getDoc(docRef);
  return docSnap;
};
