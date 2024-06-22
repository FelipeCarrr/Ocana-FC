import React, { useState, useEffect } from 'react';
import { getAllLiveStreams, deleteLiveStream } from '../../firebase/StreamFirestore';
import LiveStreamForm from './LiveStreamForm';
import EditLiveStreamForm from './EditLiveStreamForm';
import Modal from '../DashboardComponents/Modal';
import ConfirmModal from '../DashboardComponents/ConfirmModal';
import Alert from '../DashboardComponents/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const LiveStreamDashboard = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [streams, setStreams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const openConfirmModal = (stream) => {
    setSelectedStream(stream);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteLiveStream(selectedStream);
      await consultAllStreams();
      setAlert({ message: "En Vivo eliminado exitosamente.", type: "success" });
      closeConfirmModal();
    } catch (error) {
      console.error("Error al eliminar el En Vivo:", error);
      setAlert({ message: "Error al eliminar el En Vivo.", type: "error" });
    }
  };

  const openEditModal = (stream) => {
    setEditingStream(stream);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingStream(null);
    setEditModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllStreams = async () => {
    try {
      const streams = await getAllLiveStreams();
      setData(streams.docs);
      setDataFilter(streams.docs);
    } catch (error) {
      console.error("Error al cargar los En Vivos:", error);
    }
    setValueInput("");
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllStreams();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        const docData = doc.data();
        const url = docData.URL || '';
        if (url.toLowerCase().includes(valueInput.toLowerCase())) {
          actual.push(doc);
        }
      });
      setDataFilter(actual);
    }
  }, [valueInput, data]);

  useEffect(() => {
    const actual = [];
    if (dataFilter && dataFilter.length > 0) {
      try {
        for (let index = 0; index < dataFilter.length; index++) {
          const streamData = dataFilter[index].data();
          actual.push(
            <div className="w-full md:w-1/2 lg:w-1/3 p-2" key={dataFilter[index].id}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <img
                  src={streamData.frontPage}
                  alt={`img-${streamData.title}`}
                  className="w-full h-48 object-cover"
                  onClick={() => window.open(streamData.URL, "_blank")}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{streamData.title}</h3>
                  <p className="text-gray-700">{streamData.description}</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => openEditModal(dataFilter[index])}
                      className="bg-blue-500 flex items-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmModal(dataFilter[index])}
                      className="bg-red-500 flex items-center justify-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        setStreams(actual);
      } catch (error) {
        console.error("Error al renderizar los En Vivos:", error);
      }
    }
  }, [dataFilter]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Administrar Transmisión en Vivo</h2>
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
      <div className="flex flex-wrap -mx-2">
        {streams.length > 0 ? (
          streams
        ) : (
          <p className="text-center text-gray-600 w-full">No hay transmisiones en vivo para mostrar.</p>
        )}
      </div>
      <div className="fixed bottom-10 right-10">
        <button
          onClick={openModal}
          type="button"
          className="inline-flex items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Crear Transmisión en Vivo
        </button>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
          Crear Transmisión en Vivo
        </h3>
        <div className="mt-2">
          <LiveStreamForm
            onClose={closeModal}
            consultAllStreams={consultAllStreams}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
          Editar Transmisión en Vivo
        </h3>
        <div className="mt-2">
          <EditLiveStreamForm
            stream={editingStream}
            onClose={closeEditModal}
            consultAllStreams={consultAllStreams}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <ConfirmModal
        hidden={showConfirmModal}
        text="¿Estás seguro de que quieres eliminar esta transmisión en vivo?"
        onConfirm={handleDelete}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default LiveStreamDashboard;
