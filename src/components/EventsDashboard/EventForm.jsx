import React, { useState } from "react";
import { saveEvent } from "../../firebase/CalendarFirestore";

const EventForm = ({ onClose, consultAllEvents, setAlert }) => {
  const [name, setName] = useState("");
  const [years, setYears] = useState("");
  const [rol, setRol] = useState("");
  const [category, setCategory] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await saveEvent(name, years, rol, category, parseInt(day), parseInt(month));
      setName("");
      setYears("");
      setRol("");
      setCategory("");
      setDay("");
      setMonth("");
      consultAllEvents();
      setAlert({ message: "Evento creado correctamente.", type: "success" });
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      setAlert({ message: "Error al crear el evento.", type: "error" });
    }
  };

return (
    <div className="admin-panel">
      <h2 className="text-2xl mb-4">Agregar Evento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="years">
            Años
          </label>
          <input
            type="text"
            id="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="rol">
            Rol
          </label>
          <input
            type="text"
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="day">
            Día
          </label>
          <input
            type="number"
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="month">
            Mes
          </label>
          <input
            type="number"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Guardar Evento
        </button>
      </form>
    </div>
  );
};

export default EventForm;
