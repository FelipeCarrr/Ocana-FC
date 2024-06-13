import app from "./app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { useStore } from "../utils/store.js";

const storage = getStorage(app);
const db = getFirestore(app);

export const uploadFrontPage = (file) => {
  const id = nanoid();
  const refFrontPage = ref(storage, `galery/frontPages/${id}`);
  useStore.getState().ChangeLoading(true);
  const metadata = {
    contentType: "image/jpeg",
  };
  const uploadTask = uploadBytesResumable(refFrontPage, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        useStore.getState().ChangeLoadingItem("Subiendo portada");
        useStore.getState().ChangeLoadingValue(progress);
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const refFile = `galery/frontPages/${id}`;
          await saveImageReference(downloadURL, refFile);
          resolve({ downloadURL, refFile });
        });
      }
    );
  });
};

export const saveImageReference = async (downloadURL, refFile) => {
  try {
    await addDoc(collection(db, "images"), {
      downloadURL,
      refFile,
      name: refFile.split("/").pop(),
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving image reference:", error);
  }
};

export const getAllImages = async () => {
  const querySnapshot = await getDocs(collection(db, "images"));
  const images = [];
  querySnapshot.forEach((doc) => {
    images.push({ id: doc.id, ...doc.data() });
  });
  return images;
};

export const getOrderedImages = async () => {
  const imagesRef = collection(db, "images");
  const q = query(imagesRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const images = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return images;
};

export const deletedFrontPage = async (refFile) => {
  try {
    // Delete from Storage
    const Ref = ref(storage, refFile);
    await deleteObject(Ref);

    // Delete from Firestore
    const querySnapshot = await getDocs(collection(db, "images"));
    let docId = null;
    querySnapshot.forEach((doc) => {
      if (doc.data().refFile === refFile) {
        docId = doc.id;
      }
    });
    if (docId) {
      await deleteDoc(doc(db, "images", docId));
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
