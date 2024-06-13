import { useState, useEffect } from "react";
import { deletePlayer, getAllPlayers } from "../../firebase/PlayersFirestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import CardComponent from "../Card";
import ConfirmModal from "../DashboardComponents/ConfirmModal";
import PlayerForm from "./PlayerForm";
import EditPlayerForm from "./EditPlayerForm";
import Modal from "../DashboardComponents/Modal";
import Alert from "../DashboardComponents/Alert";

const AllPlayersDashboard = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [player, setPlayer] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openConfirmModal = (player) => {
    setSelectedPlayer(player);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deletePlayer(selectedPlayer);
      closeConfirmModal();
      consultAllPlayers();
      setAlert({
        message: "Jugador eliminado correctamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar el Jugador:", error);
      setAlert({ message: "Error al eliminar el jugador.", type: "error" });
    }
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingPlayer(null);
    setEditModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllPlayers = () => {
    const player = getAllPlayers();
    player.then((result) => {
      setData(result.docs);
      setDataFilter(result.docs);
    });
    setValueInput("");
  };
  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllPlayers();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        (doc.data().posicion.toLowerCase().includes(valueInput.toLowerCase()) ||
          doc
            .data()
            .jugador.toLowerCase()
            .includes(valueInput.toLowerCase())) &&
          actual.push(doc);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const actual = [];

    if (dataFilter && dataFilter.length > 0) {
      try {
        dataFilter.forEach((doc) => {
          actual.push(
            <div className="mb-6" key={doc.id}>
              <CardComponent
                jugador={doc.data().jugador}
                posicion={doc.data().posicion}
                equipo={doc.data().equipo}
                dateBirth={doc.data().dateBirth}
                imageUrl={doc.data().frontPage}
              />
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => openEditModal(doc)}
                  className="bg-blue-500 flex items-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                </button>
                <button
                  onClick={() => openConfirmModal(doc)}
                  className="bg-red-500 flex items-center justify-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                </button>
              </div>
            </div>
          );
        });
      } catch (e) {
        console.error(e);
      }
    }
    setPlayer(actual);
  }, [dataFilter]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">
        Administar Categoria Sub20
      </h2>
      <input
        type="text"
        value={valueInput}
        onChange={handleChangeValueInput}
        className="mb-4 p-2 border rounded w-full"
        placeholder="Buscar jugadores..."
      />
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      <div className="flex flex-wrap justify-center gap-10 md:gap-6 lg:gap-8">
        {player}
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Ingresar Jugador
        </h3>
        <div className="mt-2">
          <PlayerForm
            onClose={closeModal}
            consultAllPlayers={consultAllPlayers}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Editar Jugador
        </h3>
        <div className="mt-2">
          {editingPlayer && (
            <EditPlayerForm
              player={editingPlayer}
              onClose={closeEditModal}
              consultAllPlayers={consultAllPlayers}
              setAlert={setAlert}
            />
          )}
        </div>
      </Modal>
      <div className="fixed bottom-10 right-10">
        <button
          onClick={openModal}
          type="button"
          className="inline-flex items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FontAwesomeIcon icon={faUser} className="-ml-0.5 mr-2 h-5 w-5" />
          Nuevo Jugador
        </button>
      </div>
      <ConfirmModal
        hidden={showConfirmModal}
        text="¿Estás seguro de que quieres eliminar este Jugador?"
        onConfirm={handleDelete}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default AllPlayersDashboard;
