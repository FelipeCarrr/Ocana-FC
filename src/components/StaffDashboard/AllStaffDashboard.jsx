import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  deleteStaff,
  getAllStaff,
} from "../../firebase/StaffFirestore";
import ConfirmModal from "../DashboardComponents/ConfirmModal";
import Modal from "../DashboardComponents/Modal";
import Alert from "../DashboardComponents/Alert";
import StaffForm from "./StaffForm";
import EditStaffForm from "./EditStaffForm";

const AllStaffDashboard = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [staffElements, setStaffElements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openConfirmModal = (staff) => {
    setSelectedStaff(staff);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteStaff(selectedStaff);
      closeConfirmModal();
      consultAllStaff();
      setAlert({ message: "Staff eliminado correctamente", type: "success" });
    } catch (error) {
      console.error("Error al eliminar el staff:", error);
      setAlert({ message: "Error al eliminar el staff", type: "error" });
    }
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingStaff(null);
    setEditModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllStaff = async () => {
    try {
      const allStaff = await getAllStaff();
      setData(allStaff.docs);
      setDataFilter(allStaff.docs);
      setValueInput("");
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllStaff();
  }, []);

  useEffect(() => {
    const filtered = data.filter((doc) =>
      doc.data().nombre.toLowerCase().includes(valueInput.toLowerCase())
    );
    setDataFilter(filtered);
  }, [valueInput, data]);

  useEffect(() => {
    const actual = [];
    if (dataFilter && dataFilter.length > 0) {
      dataFilter.forEach((doc) => {
        actual.push(
          <div
            className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            style={{ width: "400px", height: "400px" }}
            key={doc.id}
          >
            <img
              src={doc.data().frontPage}
              alt={`img-${doc.data().nombre}`}
              className="w-full h-auto rounded-t-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {doc.data().nombre}
              </h3>
              <p className="text-gray-300">{doc.data().cargo}</p>
              <div className="flex space-x-4 mt-4">
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
          </div>
        );
      });
      setStaffElements(actual);
    }
  }, [dataFilter]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Administar Staff</h2>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      <div className="flex flex-wrap justify-center gap-8">{staffElements}</div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Crear Staff
        </h3>
        <div className="mt-2">
          <StaffForm
            onClose={closeModal}
            consultAllStaff={consultAllStaff}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Editar Staff
        </h3>
        <div className="mt-2">
          {editingStaff && (
            <EditStaffForm
              staff={editingStaff}
              onClose={closeEditModal}
              consultAllStaff={consultAllStaff}
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
          Nuevo Staff
        </button>
      </div>
      <ConfirmModal
        hidden={showConfirmModal}
        text="¿Estás seguro de que quieres eliminar este staff?"
        onConfirm={handleDelete}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default AllStaffDashboard;
