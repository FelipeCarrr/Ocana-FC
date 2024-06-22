import { useRef, useState } from "react";
import { saveStream } from "../../firebase/StreamFirestore";
import { uploadFrontPage } from "../../firebase/StorageStream";
import { useStore } from "../../utils/store";

const LiveStreamForm = ({ onClose, consultAllStreams, setAlert }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [url, setURL] = useState("");
  const [isLive, setIsLive] = useState(false);
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

  const handleChangeUrl = (e) => {
    setURL(e.target.value);
  };

  const handleIsLiveChange = (e) => {
    setIsLive(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const frontPagePromise = await uploadFrontPage(imageFile);

    try {
      const [frontPageURL] = await Promise.all([frontPagePromise]);
      ChangeLoadingItem("");
      await saveStream(url, frontPageURL.downloadURL, frontPageURL.refFile, isLive);

      ChangeLoadingValue(0);
      ChangeLoading(false);
      setURL("");
      setImage("");
      setImageFile(null);
      resetInputsFiles();
      consultAllStreams();
      setAlert({ message: "En Vivo creado exitosamente.", type: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving Stream:", error);
      setAlert({ message: "Error al crear el En Vivo.", type: "error" });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="url"
          >
            URL
          </label>
          <input
            type="text"
            id="url"
            placeholder="URL de la Noticia"
            value={url}
            onChange={handleChangeUrl}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Imagen
          </label>
          <input
            className="block file:bg-primary file:border-none file:text-white w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            id="image"
            onChange={handleChangeImage}
            ref={imageRef}
            type="file"
          />
        </div>
        {image && (
          <img
            src={image}
            alt="Selected"
            className="block w-full max-w-xs mx-auto mb-4"
          />
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="isLive"
          >
            En Vivo
          </label>
          <input
            type="checkbox"
            id="isLive"
            checked={isLive}
            onChange={handleIsLiveChange}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Crear Stream
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveStreamForm;
