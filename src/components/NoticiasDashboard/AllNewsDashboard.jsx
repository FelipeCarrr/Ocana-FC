import { useState, useEffect } from "react";
import { deleteNews, getAllNoticias } from "../../firebase/Firestore";
import NewsForm from "./NewsForm";
import Modal from "../DashboardComponents/Modal";
import EditNewsForm from "./EditNewsForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../DashboardComponents/ConfirmModal";
import Alert from "../DashboardComponents/Alert";

const AllNewsDashboard = () => {
  const [data, setData] = useState(null);
  const [dataFilter, setDataFilter] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [news, setNews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openConfirmModal = (news) => {
    setSelectedNews(news);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteNews(selectedNews);
      closeConfirmModal();
      consultAllNews();
      setAlert({ message: "Noticia eliminada exitosamente.", type: "success" });
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      setAlert({ message: "Error al eliminar la noticia.", type: "error" });
    }
  };

  const openEditModal = (news) => {
    setEditingNews(news);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingNews(null);
    setEditModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllNews = () => {
    const noticia = getAllNoticias();
    noticia
      .then((result) => {
        setData(result.docs);
        setDataFilter(result.docs);
      })
      .catch((error) => {
        console.error("Error al cargar las noticias:", error);
      });
    setValueInput("");
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllNews();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((doc) => {
        (doc.data().name.toLowerCase().includes(valueInput.toLowerCase()) ||
          doc.data().author.toLowerCase().includes(valueInput.toLowerCase())) &&
          actual.push(doc);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const actual = [];

    if (dataFilter && dataFilter.length > 0) {
      try {
        if (dataFilter && dataFilter.length > 0)
          for (let index = 0; index < dataFilter.length; index++) {
            actual.push(
              <div
                className={`rounded-lg  w-full  mb-6 break-inside-avoid-column `}
                key={dataFilter[index].id}
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={dataFilter[index].data().frontPage}
                    alt={`img-${dataFilter[index].data().title}`}
                    className="w-full"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {dataFilter[index].data().title}
                    </h3>
                    <p className="text-gray-700">
                      {dataFilter[index].data().description}
                    </p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => openEditModal(dataFilter[index])}
                        className="bg-blue-500 flex items-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNews(dataFilter[index]);
                          setShowConfirmModal(true);
                        }}
                        className="bg-red-500 flex items-center justify-center hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
      } catch (e) {
        console.error(e);
      }
    }
    setNews(actual);
  }, [dataFilter]);

  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Administrar Noticias
        </h2>
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
        <div className="w-full flex flex-wrap justify-center mt-6">
          {news.map((item, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
              {item}
            </div>
          ))}
        </div>
        <Modal isOpen={modalOpen} onClose={closeModal}>
          <h3
            className="text-lg leading-6 font-medium text-gray-900"
            id="modal-title"
          >
            Crear Noticia
          </h3>
          <div className="mt-2">
            <NewsForm
              onClose={closeModal}
              consultAllNews={consultAllNews}
              setAlert={setAlert}
            />
          </div>
        </Modal>
        <Modal isOpen={editModalOpen} onClose={closeEditModal}>
          <h3
            className="text-lg leading-6 font-medium text-gray-900"
            id="modal-title"
          >
            Editar Noticia
          </h3>
          <div className="mt-2">
            {editingNews && (
              <EditNewsForm
                news={editingNews}
                onClose={closeEditModal}
                consultAllNews={consultAllNews}
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
            <svg
              className="-ml-0.5 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Nueva Noticia
          </button>
        </div>
        <ConfirmModal
          hidden={showConfirmModal}
          text="¿Estás seguro de que quieres eliminar esta noticia?"
          onConfirm={handleDelete}
          onClose={closeConfirmModal}
        />
      </div>
    </>
  );
};

export default AllNewsDashboard;
