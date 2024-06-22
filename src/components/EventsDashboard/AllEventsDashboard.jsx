import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { getAllEvents } from "../../firebase/CalendarFirestore";
import Modal from "../DashboardComponents/Modal";
import Alert from "../DashboardComponents/Alert";
import EventForm from "./EventForm";
import CalendarComponent from "../Calendario/CalendarComponent";


const AllEventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const consultAllEvents = async () => {
    try {
      const allEvents = await getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    consultAllEvents();
  }, []);

  return (
    <div className="w-full min-h-screen p-4">
      <h2 className="text-3xl font-bold text-center mb-12">Administrar Eventos</h2>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })}
      />
      <div className="w-full mb-6">
        <CalendarComponent />
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={openModal}
          type="button"
          className="inline-flex items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FontAwesomeIcon icon={faCalendarPlus} className="-ml-0.5 mr-2 h-5 w-5" />
          Nuevo Evento
        </button>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
          Crear Evento
        </h3>
        <div className="mt-2">
          <EventForm
            onClose={closeModal}
            consultAllEvents={consultAllEvents}
            setAlert={setAlert}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AllEventsDashboard;
