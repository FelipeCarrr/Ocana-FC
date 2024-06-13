import { useState, useEffect } from "react";
import {
  getOrderedImages,
  deletedFrontPage,
} from "../../firebase/GalleryFirestore";
import { getAllImages } from "../../firebase/GalleryFirestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faImage } from "@fortawesome/free-solid-svg-icons";

import ConfirmModal from "../DashboardComponents/ConfirmModal";
import Modal from "../DashboardComponents/Modal";
import GaleryForm from "./GalleryForm";
import Alert from "../DashboardComponents/Alert";

const AllGaleryDashboard = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [image, setImage] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openConfirmModal = (image) => {
    setSelectedImage(image);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    try {
      await deletedFrontPage(selectedImage.refFile);
      closeConfirmModal();
      consultAllImages();
      setAlert({ message: "Imagen eliminada correctamente", type: "success" });
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setAlert({ message: "Error al eliminar la imagen", type: "error" });
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllImages = async () => {
    try {
      const allImages = await getAllImages();
      setData(allImages);
      setDataFilter(allImages);
      setValueInput("");
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleChangeValueInput = (e) => {
    setValueInput(e.target.value);
  };

  useEffect(() => {
    consultAllImages();
  }, []);

  useEffect(() => {
    const actual = [];
    if (data && data.length > 0) {
      data.forEach((img) => {
        img.name.toLowerCase().includes(valueInput.toLowerCase()) &&
          actual.push(img);
      });
      setDataFilter(actual);
    }
  }, [valueInput]);

  useEffect(() => {
    const fetchImages = async () => {
      const dataFilter = await getOrderedImages();

      const actual = [];

      if (dataFilter && dataFilter.length > 0) {
        try {
          dataFilter.forEach((img) => {
            actual.push(
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-8"
                key={img.refFile}
              >
                <img src={img.downloadURL} alt={img.name} className="w-full" />
                <div className="p-4 flex justify-center space-x-4">
                  <button
                    onClick={() => openConfirmModal(img)}
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
      setImage(actual);
      setFilteredImages(actual);
    };
    fetchImages();
  }, [dataFilter]);

  useEffect(() => {
    const filtered = image.filter((img) =>
      img.props.children[0].props.alt
        .toLowerCase()
        .includes(valueInput.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [valueInput, image]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">
        Administrar Galería
      </h2>
      {/* <input
        type="text"
        value={valueInput}
        onChange={handleChangeValueInput}
        className="mb-4 p-2 border rounded w-full"
        placeholder="Buscar imágenes..."
      /> */}
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredImages}
          </div>
        </div>
      </section>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3
          className="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          Subir Imagen
        </h3>
        <div className="mt-2">
          <GaleryForm
            onClose={closeModal}
            consultAllImages={consultAllImages}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <div className="fixed bottom-10 right-10">
        <button
          onClick={openModal}
          type="button"
          className="inline-flex items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FontAwesomeIcon icon={faImage} className="-ml-0.5 mr-2 h-5 w-5" />
          Nueva Imagen
        </button>
      </div>
      <ConfirmModal
        hidden={showConfirmModal}
        text="¿Estás seguro de que quieres eliminar esta imagen?"
        onConfirm={handleDelete}
        onClose={closeConfirmModal}
      />
    </div>
  );
};

export default AllGaleryDashboard;
