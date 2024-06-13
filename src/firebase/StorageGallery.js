import app from "./app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { useStore } from "../utils/store.js";

const storage = getStorage(app);

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        useStore.getState().ChangeLoadingItem("Subiendo portada");
        useStore.getState().ChangeLoadingValue(progress);
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const refFile = `galery/frontPages/${id}`;
          resolve({ downloadURL, refFile });
        });
      }
    );
  });
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
