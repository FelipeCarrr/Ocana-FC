import { useState, useEffect } from "react";
import { updateNews } from "../../firebase/Firestore";
import { useStore } from "../../utils/store";
import { updatedFrontPage } from "../../firebase/Storage";

const EditNewsForm = ({ onClose, news, consultAllNews }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [edit, setEdit] = useState(false);
  const [ChangeLoading, ChangeLoadingValue, ChangeLoadingItem] = useStore(
    (state) => [
      state.ChangeLoading,
      state.ChangeLoadingValue,
      state.ChangeLoadingItem,
    ]
  );

  const valuesDefault = () => {
    if (news) {
        setTitle(news.data().title);
        setDescription(news.data().description);
        setURL(news.data().URL);
        setImage(news.data().frontPage);
        setImageFile("");
    }
    setEdit(false);
  };
  
  useEffect(() => {
    valuesDefault();
  }, [news]);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const frontPagePromise = imageFile
        ? await updatedFrontPage(imageFile, news.data().frontPageRef)
        : Promise.resolve({
            downloadURL: news.data().frontPage,
            refFile: news.data().frontPageRef,
          });
        ChangeLoadingItem("");
  
      const [frontPageURL] = await Promise.all([frontPagePromise]);
  
      await updateNews(
        news.id,
        title,
        description,
        url,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );
  
      ChangeLoadingValue(0);
      ChangeLoading(false);
      consultAllNews();
      onClose();
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
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
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
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
        <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">
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
        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
          Imagen
        </label>
        <input
          className="block file:bg-primary file:border-none file:text-white w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          id="image"
          onChange={handleChangeImage}
          type="file"
        />
      </div>
      {image && <img src={image} alt="Selected" className="block w-full max-w-xs mx-auto mb-4" />}
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

export default EditNewsForm;
