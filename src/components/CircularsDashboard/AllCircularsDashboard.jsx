import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  deleteCircular,
  getAllCirculars,
} from "../../firebase/CircularsFirestore";
import ConfirmModal from "../DashboardComponents/ConfirmModal";
import Modal from "../DashboardComponents/Modal";
import Alert from "../DashboardComponents/Alert";
import CircularForm from "./CircularForm";
import EditCircularForm from "./EditCircularForm";

const AllCircularsDashboard = () => {
  const [circulars, setCirculars] = useState([]);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [circularElements, setCircularElements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openConfirmModal = (circular) => {
    setSelectedCircular(circular);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCircular(selectedCircular.id);
      closeConfirmModal();
      fetchAllCirculars();
      setAlert({
        message: "Circular eliminada correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar la circular:", error);
      setAlert({ message: "Error al eliminar la circular", type: "error" });
    }
  };

  const openEditModal = (circular) => {
    setEditingCircular(circular);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingCircular(null);
    setEditModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchAllCirculars = async () => {
    try {
      const allCirculars = await getAllCirculars();
      setCirculars(allCirculars.docs);
      setFilteredCirculars(allCirculars.docs);
      setSearchInput("");
    } catch (error) {
      console.error("Error fetching circulars:", error);
    }
  };

  const handleChangeSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    fetchAllCirculars();
  }, []);

  useEffect(() => {
    const filtered = circulars.filter((doc) =>
      doc.data().title.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCirculars(filtered);
  }, [searchInput, circulars]);

  useEffect(() => {
    const circularList = [];
    if (filteredCirculars && filteredCirculars.length > 0) {
      filteredCirculars.forEach((doc) => {
        circularList.push(
          <div
            className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            style={{ width: "400px", height: "250px" }}
            key={doc.id}
          >
            <div className="p-4">
              {/* Icono más grande para hacer referencia al archivo PDF */}
              <div className="flex justify-center mb-4">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  size="6x"
                  className="text-red-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {doc.data().title}
              </h3>
              <div className="flex justify-center space-x-4 mt-4">
                <a
                  href={doc.data().fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 flex items-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Ver PDF
                </a>
                <button
                  onClick={() => openEditModal(doc)}
                  className="bg-blue-500 flex items-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Editar
                </button>
                <button
                  onClick={() => openConfirmModal(doc)}
                  className="bg-red-500 flex items-center justify-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      });
      setCircularElements(circularList);
    }
  }, [filteredCirculars]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">
        Administrar Circulares
      </h2>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      <div className="flex flex-wrap justify-center gap-8">
        {circularElements}
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Crear Circular
        </h3>
        <div className="mt-2">
          <CircularForm
            onClose={closeModal}
            consultAllCirculars={fetchAllCirculars}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Editar Circular
        </h3>
        <div className="mt-2">
          {editingCircular && (
            <EditCircularForm
              circular={editingCircular}
              onClose={closeEditModal}
              fetchAllCirculars={fetchAllCirculars}
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
          <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-2xl" />
          Nueva Circular
        </button>
      </div>
      <ConfirmModal
        hidden={showConfirmModal}
        text="¿Estás seguro de que quieres eliminar esta circular?"
        onConfirm={handleDelete}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default AllCircularsDashboard;
