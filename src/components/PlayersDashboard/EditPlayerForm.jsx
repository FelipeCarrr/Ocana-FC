import { useState, useEffect } from "react";
import { updatedFrontPage } from "../../firebase/StoragePlayers";
import { updatePlayer } from "../../firebase/PlayersFirestore";
import { useStore } from "../../utils/store";

const EditPlayerForm = ({ onClose, player, consultAllPlayers, setAlert }) => {
  const [jugador, setJugador] = useState("");
  const [posicion, setPosicion] = useState("");
  const [equipo, setEquipo] = useState("");
  const [dateBirth, setDateBirth] = useState("");
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
    if (player) {
      setJugador(player.data().jugador);
      setPosicion(player.data().posicion);
      setEquipo(player.data().equipo);
      setDateBirth(player.data().dateBirth);
      setImage(player.data().frontPage);
      setImageFile("");
    }
    setEdit(false);
  };

  useEffect(() => {
    valuesDefault();
  }, [player]);

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
    setDateBirth(e.target.value);
  };

  const handleChangeImage = (e) => {
    if (e.target.files.lenght > 0) {
      const selectedImage = URL.createObjectURL(e.target.files[0]);
      setImage(selectedImage);
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const frontPagePromise = imageFile
        ? await updatedFrontPage(imageFile, player.data().frontPageRef)
        : Promise.resolve({
            downloadURL: player.data().frontPage,
            refFile: player.data().frontPageRef,
          });
      ChangeLoadingItem("");

      const [frontPageURL] = await Promise.all([frontPagePromise]);

      await updatePlayer(
        player.id,
        jugador,
        posicion,
        equipo,
        dateBirth,
        frontPageURL.downloadURL,
        frontPageURL.refFile
      );
      ChangeLoadingValue(0);
      ChangeLoading(false);
      consultAllPlayers();
      setAlert({
        message: "Jugador actualizado correctamente.",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.log("Error al actualizar el Jugador", error);
      setAlert({ message: "Error al actualizar el Jugador.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="jugador"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          htmlFor="posicion"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Posición
        </label>
        <input
          id="posicion"
          placeholder="Posición del Jugador"
          value={posicion}
          onChange={handleChangePosicion}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="equipo"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          htmlFor="dateBirth"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Fecha de Nacimiento
        </label>
        <input
          type="text"
          id="dateBirth"
          placeholder="Fecha de Nacimiento"
          value={dateBirth}
          onChange={handleChangeDateBirth}
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

export default EditPlayerForm;
