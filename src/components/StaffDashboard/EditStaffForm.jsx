import { useEffect, useState } from "react";
import { useStore } from "../../utils/store";
import { updatedFrontPage } from "../../firebase/StorageStaff";
import { updateStaff } from "../../firebase/StaffFirestore";

const EditStaffForm = ({ onClose, staff, consultAllStaff, setAlert }) => {
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
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
    if (staff) {
      setNombre(staff.data().nombre);
      setCargo(staff.data().cargo);
      setImage(staff.data().frontPage);
      setImageFile("");
    }
    setEdit(false);
  };

  useEffect(() => {
    valuesDefault();
  }, [staff]);

  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleChangeCargo = (e) => {
    setCargo(e.target.value);
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
        ? await updatedFrontPage(imageFile, staff.data().frontPageRef)
        : Promise.resolve({
            downloadURL: staff.data().frontPage,
            refFile: staff.data().frontPageRef,
          });
      ChangeLoadingItem("");
      const [frontPageURL] = await Promise.all([frontPagePromise]);

      await updateStaff(
        staff.id,
        nombre,
        cargo,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );
      ChangeLoadingValue(0);
      ChangeLoading(false);
      consultAllStaff();
      setAlert({
        message: "Staff actualizado correctamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.log("Error al actualizar el Staff", error);
      setAlert({ message: "Error al actualizar el Staff.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="nombre"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre del Staff"
          value={nombre}
          onChange={handleChangeNombre}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="cargo"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Cargo
        </label>
        <input
          id="cargo"
          placeholder="Cargo del Staff"
          value={cargo}
          onChange={handleChangeCargo}
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

export default EditStaffForm;
