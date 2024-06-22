import { useState, useEffect } from 'react';
import { updateLiveStream } from '../../firebase/StreamFirestore';
import { updatedFrontPage } from '../../firebase/StorageStream';
import { useStore } from "../../utils/store";

const EditLiveStreamForm = ({ onClose, stream, consultAllStreams, setAlert }) => {
  const [url, setURL] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [isLive, setIsLive] = useState(false); // Nuevo estado para isLive
  const [edit, setEdit] = useState(false);
  const [ChangeLoading, ChangeLoadingValue, ChangeLoadingItem] = useStore(
    (state) => [
      state.ChangeLoading,
      state.ChangeLoadingValue,
      state.ChangeLoadingItem,
    ]
  );

  const valuesDefault = () => {
    if (stream) {
      setURL(stream.data().URL);
      setImage(stream.data().frontPage);
      setIsLive(stream.data().isLive); // Establecer el valor predeterminado de isLive
      setImageFile("");
    }
    setEdit(false);
  };

  useEffect(() => {
    valuesDefault();
  }, [stream]);

  const handleChangeUrl = (e) => {
    setURL(e.target.value);
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = URL.createObjectURL(e.target.files[0]);
      setImage(selectedImage);
      setImageFile(e.target.files[0]);
    }
  };

  const handleIsLiveChange = (e) => {
    setIsLive(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const frontPagePromise = imageFile
        ? await updatedFrontPage(imageFile, stream.data().frontPageRef)
        : Promise.resolve({
            downloadURL: stream.data().frontPage,
            refFile: stream.data().frontPageRef,
          });
      ChangeLoadingItem("");

      const [frontPageURL] = await Promise.all([frontPagePromise]);

      await updateLiveStream(
        stream.id,
        url,
        frontPageURL.downloadURL,
        frontPageURL.refFile,
        isLive // Añadir isLive al método de actualización
      );

      ChangeLoadingValue(0);
      ChangeLoading(false);
      consultAllStreams();
      setAlert({
        message: "En Vivo actualizado exitosamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar el En Vivo:", error);
      setAlert({ message: "Error al actualizar el En Vivo.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="url"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          htmlFor="image"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Imagen
        </label>
        <input
          className="block file:bg-primary file:border-none file:text-white w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          id="image"
          onChange={handleChangeImage}
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
          htmlFor="isLive"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          ¿Está en vivo?
        </label>
        <input
          type="checkbox"
          id="isLive"
          checked={isLive}
          onChange={handleIsLiveChange}
          className="mr-2 leading-tight"
        />
        <span className="text-sm">Sí</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default EditLiveStreamForm;
