import { useRef, useState } from "react";
import { useStore } from "../../utils/store";
import { uploadCircularPDF } from "../../firebase/StorageCircular"; // Función para subir PDFs
import { saveCircular } from "../../firebase/CircularsFirestore"; // Función para guardar los datos en Firestore

const CircularForm = ({ onClose, consultAllCirculars, setAlert }) => {
  const [pdf, setPdf] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ChangeLoading, ChangeLoadingValue, ChangeLoadingItem] = useStore(
    (state) => [
      state.ChangeLoading,
      state.ChangeLoadingValue,
      state.ChangeLoadingItem,
    ]
  );
  const pdfRef = useRef(null);

  const handleChangePDF = (e) => {
    if (e.target.files.length > 0) {
      setPdf(e.target.files[0]);
    }
  };

  const resetInputsFiles = () => {
    pdfRef.current.value = null;
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      ChangeLoading(true);
      const { downloadURL, refFile } = await uploadCircularPDF(pdf);
      ChangeLoadingItem("");
      await saveCircular(title, description, downloadURL, refFile);
      ChangeLoadingValue(0);
      ChangeLoading(false);
      setTitle("");
      setDescription("");
      setPdf(null);
      resetInputsFiles();
      consultAllCirculars();
      setAlert({
        message: "Circular subida correctamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error subiendo la circular:", error);
      setAlert({ message: "Error al subir la circular.", type: "error" });
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
            placeholder="Ingrese el título de la circular"
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
            placeholder="Descripción de la circular"
            value={description}
            onChange={handleChangeDescription}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pdf"
          >
            Archivo PDF
          </label>
          <input
            className="block file:bg-primary file:border-none file:text-white w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            id="pdf"
            onChange={handleChangePDF}
            ref={pdfRef}
            type="file"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Subir Circular
          </button>
        </div>
      </form>
    </div>
  );
};

export default CircularForm;
