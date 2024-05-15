import app from "./app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { auth } from "./Auth.js";
import { useStore } from "../utils/store.js";

const storage = getStorage(app);

export const uploadFrontPage = async (file) => {
  const id = nanoid();
  const refFrontPage = ref(storage, `noticias/frontPages/${id}`);
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
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            break;
        }
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const refFile = `noticias/frontPages/${id}`;
          resolve({ downloadURL, refFile });
        });
      }
    );
  });
};

export const updatedFrontPage = async (file, FileRef) => {
  try {
    const Ref = ref(storage, FileRef);
    await deleteObject(Ref);
    const result = await uploadFrontPage(file);
    return result;
  } catch (error) {
    console.error("Error al actualizar la portada:", error);
    throw error;
  }
};

export const deletedFrontPage = async (FileRef) => {
  try {
    const Ref = ref(storage, FileRef);
    await deleteObject(Ref);
  } catch (error) {
    console.error("Error al borrar la portada:", error);
    throw error;
  }
};
