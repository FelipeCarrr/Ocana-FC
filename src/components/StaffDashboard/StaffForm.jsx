import { useRef, useState } from "react";
import { useStore } from "../../utils/store";
import { uploadFrontPage } from "../../firebase/StorageStaff";
import { saveStaff } from "../../firebase/StaffFirestore";

const StaffForm = ({ onClose, consultAllStaff, setAlert }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
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

  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleChangeCargo = (e) => {
    setCargo(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const frontPagePromise = await uploadFrontPage(imageFile);
    try {
      const [frontPageURL] = await Promise.all([frontPagePromise]);
      ChangeLoadingItem("");
      await saveStaff(
        nombre,
        cargo,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );
      ChangeLoadingValue(0);
      ChangeLoading(false);
      setNombre("");
      setCargo("");
      setImage("");
      setImageFile(null);
      resetInputsFiles();
      consultAllStaff();
      setAlert({
        message: "Staff ingresado correctamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving staff:", error);
      setAlert({ message: "Error al ingresar al staff.", type: "error" });
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
          htmlFor="nombre"
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Ingrese el nombre del Staff"
          value={nombre}
          onChange={handleChangeNombre}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="cargo"
        >
          Cargo
        </label>
        <input
          id="cargo"
          type="text"
          placeholder="Posición del Jugador"
          value={cargo}
          onChange={handleChangeCargo}
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
          Crear Staff
        </button>
      </div>
    </form>
  </div>
  );
};

export default StaffForm;
