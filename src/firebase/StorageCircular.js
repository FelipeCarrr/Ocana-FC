import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { nanoid } from "nanoid";
import { useStore } from "../utils/store.js";
import app from "./app.js";

const storage = getStorage(app);

export const uploadCircularPDF = async (file) => {
  const id = nanoid();
  const refPDF = ref(storage, `circulars/${id}`);
  useStore.getState().ChangeLoading(true);
  const metadata = {
    contentType: "application/pdf",
  };

  const uploadTask = uploadBytesResumable(refPDF, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        useStore.getState().ChangeLoadingItem("Subiendo archivo PDF");
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
          const refFile = `circulars/${id}`;
          resolve({ downloadURL, refFile });
        });
      }
    );
  });
};
