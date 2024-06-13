import { useRef, useState } from "react";

import { uploadFrontPage } from "../../firebase/StoragePlayers";
import { savePlayer } from "../../firebase/PlayersFirestore";
import { useStore } from "../../utils/store";

const PlayerForm = ({ onClose, consultAllPlayers, setAlert }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [jugador, setJugador] = useState("");
  const [posicion, setPosicion] = useState("");
  const [equipo, setEquipo] = useState("");
  const [dateBirth, setDateBirtd] = useState("");
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

  const handleChangeJugador = (e) => {
    setJugador(e.target.value);
  };

  const handleChangePosicion = (e) => {
    setPosicion(e.target.value);
  };

  const handleChangeEquipo = (e) => {
    setEquipo(e.target.value);
  };

  const handleChangeDateBirth = (e) => {
    setDateBirtd(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const frontPagePromise = await uploadFrontPage(imageFile);
    try {
      const [frontPageURL] = await Promise.all([frontPagePromise]);
      ChangeLoadingItem("");
      await savePlayer(
        jugador,
        posicion,
        equipo,
        dateBirth,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );
      ChangeLoadingValue(0);
      ChangeLoading(false);
      setJugador("");
      setPosicion("");
      setEquipo("");
      setDateBirtd("");
      setImage("");
      setImageFile(null);
      resetInputsFiles();
      consultAllPlayers();
      setAlert({
        message: "Jugador ingresado correctamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving player:", error);
      setAlert({ message: "Error al ingresar al jugador.", type: "error" });
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
            htmlFor="jugador"
          >
            Jugador
          </label>
          <input
            id="jugador"
            type="text"
            placeholder="Ingrese el nombre del Jugador"
            value={jugador}
            onChange={handleChangeJugador}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="posicion"
          >
            Posición
          </label>
          <input
            id="posicion"
            type="text"
            placeholder="Posición del Jugador"
            value={posicion}
            onChange={handleChangePosicion}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="equipo"
          >
            Equipo
          </label>
          <input
            type="text"
            id="equipo"
            placeholder="Equipo del Jugador"
            value={equipo}
            onChange={handleChangeEquipo}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateBirth"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="text"
            id="dateBirth"
            placeholder="Equipo del Jugador"
            value={dateBirth}
            onChange={handleChangeDateBirth}
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
            Crear Jugador
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;
