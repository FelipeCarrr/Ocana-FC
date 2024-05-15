import { useRef, useState } from "react";

import { uploadFrontPage } from "../../firebase/Storage";
import { saveNews } from "../../firebase/Firestore";
import { useStore } from "../../utils/store";

const NewsForm = ({ onClose, consultAllNews }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
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

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeUrl = (e) => {
    setURL(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const frontPagePromise = await uploadFrontPage(imageFile);

    try {
      const [frontPageURL] = await Promise.all([frontPagePromise]);
      ChangeLoadingItem("");
      await saveNews(
        title,
        description,
        url,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );

      ChangeLoadingValue(0);
      ChangeLoading(false);
      setTitle("");
      setDescription("");
      setURL("");
      setImage("");
      setImageFile(null);
      resetInputsFiles();
      consultAllNews();
      onClose();
    } catch (error) {
      console.error("Error saving news:", error);
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
            htmlFor="title"
          >
            Título
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ingrese el título de la noticia"
            value={title}
            onChange={handleChangeTitle}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            id="description"
            placeholder="Descripción de la Noticia"
            value={description}
            onChange={handleChangeDescription}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Crear Noticia
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
