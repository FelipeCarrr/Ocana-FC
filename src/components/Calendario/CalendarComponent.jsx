import { useState, useEffect  } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import ModalCalendar from "../DashboardComponents/ModalCalendar.jsx"; 
import events from "../../data/events.js";
import { getAllEvents } from "../../firebase/CalendarFirestore";
import "../css/CalendarStyle.css";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getAllEvents();
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const getDaysOfWeek = () => ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDay = (day) => {
    if (!events) return [];
    return events.filter(
      (event) => event.day === day && event.month === currentMonth
    );
  };

  const openModal = (events) => {
    setSelectedEvents(events);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedEvents([]);
    setModalIsOpen(false);
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className="container mx-auto p-4 font-roboto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="text-gray-700 p-2 rounded transform hover:scale-110 transition-transform"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="2x" />
        </button>
        <h2 className="text-2xl font-bold">{`${
          monthNames[currentMonth - 1]
        } ${currentYear}`}</h2>
        <button
          onClick={handleNextMonth}
          className="text-gray-700 p-2 rounded transform hover:scale-110 transition-transform"
        >
          <FontAwesomeIcon icon={faChevronRight} size="2x" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {getDaysOfWeek().map((dayOfWeek, index) => (
          <div key={index} className="text-center font-bold">
            {dayOfWeek}
          </div>
        ))}
        {Array.from(
          { length: daysInMonth(currentMonth, currentYear) },
          (_, i) => i + 1
        ).map((day) => {
          const dayEvents = getEventsForDay(day);
          const isEventDay = dayEvents.length > 0;
          const isHovered = hoveredDay === day;

          return (
            <div
              key={day}
              className={`day p-4 text-center cursor-pointer rounded-lg ${
                isEventDay ? "has-events" : ""
              } ${isHovered ? "hovered" : ""}`}
              onClick={() => {
                if (dayEvents.length > 0) {
                  openModal(dayEvents);
                }
              }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {dayEvents.length > 0 && <div className="event-dot"></div>}
              {day}
            </div>
          );
        })}
      </div>
      <ModalCalendar isOpen={modalIsOpen} onClose={closeModal}>
        {selectedEvents.length > 0 && (
          <div className="event-details p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Cumpleaños del Día</h2>
            {selectedEvents.map((event, index) => (
              <div key={index}>
                <p>
                  <strong>Nombre:</strong> {event.name}
                </p>
                <p>
                  <strong>Años:</strong> {event.years}
                </p>
                <p>
                  <strong>Rol:</strong> {event.rol}
                </p>
                <p>
                  <strong>Categoría:</strong> {event.category}
                </p>
                {index < selectedEvents.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        )}
      </ModalCalendar>
    </div>
  );
};

export default CalendarComponent;
