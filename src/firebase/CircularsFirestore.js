import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import app from "./app.js";

const db = getFirestore(app);
const circularsCollection = collection(db, "circulars");

// Función para guardar una circular en Firestore
export const saveCircular = async (title, description, fileURL, fileRef) => {
  try {
    const docRef = await addDoc(circularsCollection, {
      title,
      description,
      fileURL,
      fileRef,
      createdAt: new Date(),
    });
    return docRef;
  } catch (error) {
    console.error("Error al guardar la circular:", error);
    throw error;
  }
};

// Función para actualizar una circular en Firestore
export const updateCircular = async (id, title, description, fileURL, fileRef) => {
  try {
    const docRef = doc(db, "circulars", id);
    await updateDoc(docRef, {
      title,
      description,
      fileURL,
      fileRef,
      updatedAt: new Date(),  // Opcional: Puedes agregar un campo para saber cuándo se actualizó
    });
  } catch (error) {
    console.error("Error al actualizar la circular:", error);
    throw error;
  }
};

// Función para obtener todas las circulares
export const getAllCirculars = async () => {
  try {
    const querySnapshot = await getDocs(circularsCollection);
    return querySnapshot;
  } catch (error) {
    console.error("Error al obtener las circulares:", error);
    throw error;
  }
};

// Función para eliminar una circular
export const deleteCircular = async (id) => {
  try {
    const docRef = doc(db, "circulars", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar la circular:", error);
    throw error;
  }
};
