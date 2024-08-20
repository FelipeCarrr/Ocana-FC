import { useState } from "react";
import { uploadCircularPDF } from "../../firebase/StorageCircular";
import { updateCircular } from "../../firebase/CircularsFirestore";

const EditCircularForm = ({ circular, onClose, fetchAllCirculars, setAlert }) => {
  const [title, setTitle] = useState(circular.data().title);
  const [description, setDescription] = useState(circular.data().description);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fileURL = circular.data().fileURL;
      let fileRef = circular.data().fileRef;

      if (file) {
        const uploadResult = await uploadCircularPDF(file);
        fileURL = uploadResult.downloadURL;
        fileRef = uploadResult.refFile;
      }

      await updateCircular(circular.id, title, description, fileURL, fileRef);
      fetchAllCirculars();
      setAlert({ message: "Circular editada correctamente", type: "success" });
      onClose();
    } catch (error) {
      console.error("Error al editar la circular:", error);
      setAlert({ message: "Error al editar la circular", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Seleccionar nuevo archivo PDF (opcional)
        </label>
        <input
          type="file"
          id="file"
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

export default EditCircularForm;
