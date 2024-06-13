import { useState, useRef } from "react";
import { uploadFrontPage } from "../../firebase/StorageGallery";
import { saveImageReference } from "../../firebase/GalleryFirestore";
import { useStore } from "../../utils/store";

const GaleryForm = ({ onClose, consultAllImages, setAlert }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [ChangeLoading, ChangeLoadingValue, ChangeLoadingItem] = useStore(
    (state) => [
      state.ChangeLoading,
      state.ChangeLoadingValue,
      state.ChangeLoadingItem,
    ]
  );
  const imageRef = useRef(null);

  const handleChangeImage = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = URL.createObjectURL(e.target.files[0]);
      setImage(selectedImage);
      setImageFile(e.target.files[0]);
    }
  };

  const resetInputsFiles = () => {
    imageRef.current.value = null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      alert("Por favor, selecciona una imagen para subir.");
      return;
    }

    try {
      const frontPageURL = await uploadFrontPage(imageFile);
      await saveImageReference(frontPageURL.downloadURL, frontPageURL.refFile);
      setImage("");
      setImageFile(null);
      resetInputsFiles();
      consultAllImages();
      setAlert({ message: "Imagen subida correctamente", type: "success" });
      onClose();
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      setAlert({ message: "Error subiendo la imagen", type: "error" });
    } finally {
      ChangeLoading(false);
      ChangeLoadingValue(0);
      ChangeLoadingItem("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Imagen
        </label>
        <input
          type="file"
          ref={imageRef}
          accept="image/*"
          onChange={handleChangeImage}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {image && (
        <div className="mb-4">
          <img src={image} alt="Preview" className="w-full h-auto" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Subir Imagen
        </button>
      </div>
    </form>
  );
};

export default GaleryForm;
